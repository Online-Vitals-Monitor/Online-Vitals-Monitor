import { useCallback, useEffect, useRef, useState } from "react";

type UseVitalsAudioOptions = {
  enabled: boolean;
  heartRate: number;
  o2Saturation: number;
  volume: number;
};

type BrowserWindowWithAudio = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

// adjust for alarms to trigger sooner/later
const LOW_HEART_RATE_WARNING = 50;
const FLATLINE_HEART_RATE = 10;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getSpo2BeepFrequency = (o2Saturation: number) => {
  const safeSpo2 = clamp(o2Saturation || 0, 70, 100);

  // pulse ox monitors usually lower the beep pitch as SpO2 drops.
  // I think 850 Hz is a healthy top pitch
  // each point below 100 drops by 5 Hz
  return 850 - (100 - safeSpo2) * 5;
};

export function useVitalsAudio({
  enabled,
  heartRate,
  o2Saturation,
  volume,
}: UseVitalsAudioOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const startAudio = useCallback(async () => {
    // browsers block audio until a user input, so use an Enable Sound button instead of starting automatically on page load
    const AudioContextClass =
      window.AudioContext ||
      (window as BrowserWindowWithAudio).webkitAudioContext;

    if (!AudioContextClass) {
      console.warn("Web Audio API is not supported in this browser");
      return false;
    }

    if (!audioContextRef.current) {
      const context = new AudioContextClass();
      const masterGain = context.createGain();

      // single volume control for every generated tone
      masterGain.gain.value = 0;
      masterGain.connect(context.destination);

      audioContextRef.current = context;
      masterGainRef.current = masterGain;
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    setIsAudioReady(true);
    return true;
  }, []);

  useEffect(() => {
    const masterGain = masterGainRef.current;
    if (!masterGain) return;

    const safeVolume = enabled ? clamp(volume, 0, 1) : 0;

    // smooth volume changes so toggling sound or dragging the slider does not pop
    masterGain.gain.setTargetAtTime(
      safeVolume,
      audioContextRef.current?.currentTime ?? 0,
      0.03,
    );
  }, [enabled, volume]);

  useEffect(() => {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (!enabled || !isAudioReady || !context || !masterGain || volume <= 0) {
      return;
    }

    let timeoutId: number | undefined;

    // adjust duration/gain/waveform here for the overall sound shape
    const playTone = (
      frequency: number,
      duration: number,
      gain: number,
      waveform: OscillatorType = "triangle", // sharper/softer
      startDelay = 0,
    ) => {
      const startTime = context.currentTime + startDelay;
      const releaseStart = Math.max(0.01, duration - 0.025);
      const oscillator = context.createOscillator();
      const toneGain = context.createGain();

      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // quick attack and short release keep the beep clean without clicks
      toneGain.gain.setValueAtTime(0.0001, startTime);
      toneGain.gain.linearRampToValueAtTime(gain, startTime + 0.004);
      toneGain.gain.setValueAtTime(gain, startTime + releaseStart);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      oscillator.connect(toneGain);
      toneGain.connect(masterGain);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const playVitalBeep = () => {
      playTone(getSpo2BeepFrequency(o2Saturation), 0.16, 0.75);  // normal monitor beep: pitch follows SpO2, interval follows ECG heart rate

      const safeHeartRate = clamp(heartRate, 20, 240);  // prevents impossible/mock values from creating rapid-fire or frozen timers.
      timeoutId = window.setTimeout(playVitalBeep, 60000 / safeHeartRate);
    };

    const playLowHeartRateWarning = () => {
      // double chirp warning for slow resting heart rate
      playTone(900, 0.16, 0.65);
      playTone(900, 0.16, 0.65, "triangle", 0.24);
      timeoutId = window.setTimeout(playLowHeartRateWarning, 1200);
    };

    const playFlatlineAlarm = () => {
      // critical tone for no/critically low heart rate
      playTone(950, 0.85, 0.5, "triangle");
      timeoutId = window.setTimeout(playFlatlineAlarm, 1000);
    };

    if (heartRate <= FLATLINE_HEART_RATE) {
      playFlatlineAlarm();   // critical state wins over the low-heart-rate warning
    } else if (heartRate < LOW_HEART_RATE_WARNING) {
      playLowHeartRateWarning();
    } else {
      playVitalBeep();
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [enabled, heartRate, isAudioReady, o2Saturation, volume]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return { isAudioReady, startAudio };
}