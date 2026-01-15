import React, { useEffect, useRef, useMemo, useCallback } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
} from "chart.js";
// import { gsap } from "gsap"; // for smooth easing and sync with API

// set chart type/components and expected values to recieve
Chart.register(LineController, LineElement, PointElement, LinearScale);

type WaveformChartProps = {
  elementId: string;
  beatData: number[]; // one beat of data
  color: string;
  height: number;
  easing?: string; // GSAP easing name
  waveformType?: "ecg"; // add | "other options" | in the future 
  width: number;
  mmPerSecond?: number; // waveform speed - 25 mm/sec for standard ECG waveform speed
  vitalValue: number
};

export default function WaveformChart({ 
  elementId,
  beatData,
  color,
  height,
  width,
  mmPerSecond = 25,
  vitalValue,
}: WaveformChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // drawn in canvas
  const chartRef = useRef<Chart | null>(null); // chart instance

  // set up rolling buffer
  const bufferRef = useRef<number[]>([]); // set up buffer for waveform
  useEffect(() => {
    bufferRef.current = new Array(width).fill(0)
  }, [width]);

  // track position in the current beat cycle
  const sampleIndexRef = useRef(0);

  // constants for timing
  const pxPerMm = 5; 
  const pxPerSec = mmPerSecond * pxPerMm;

  // // set up one single beat
  // const beat = useMemo(() => beatData, [beatData]);

  // const beatIndexRef = useRef(0);

  // generate the next beat
  const nextSample = useCallback(() => {
    // 1. calculate how many total pixels (samples) one full cycle should take
    // total pixels = (pixels per second) / (beats per second)
    const samplesPerBeat = pxPerSec / (vitalValue / 60);

    const currentIdx = sampleIndexRef.current;
    let value = 0;

    if (currentIdx < beatData.length) {
      // draw beat
      value = beatData[currentIdx];
    } else {
      // space between beats
      value = beatData[beatData.length - 1]; 
    }

    // increment index and reset if we've reached the end of the beat
    sampleIndexRef.current = currentIdx + 1;
    if (sampleIndexRef.current >= samplesPerBeat) {
      sampleIndexRef.current = 0;
    }

    return value;

  }, [beatData, vitalValue, pxPerSec]);

  // set up the chart
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            data: bufferRef.current.map((y, x) => ({x, y})),
            borderColor: color,
            borderWidth: 2,
            pointRadius: 0,
            spanGaps: false,
            tension: 0.3, //smoothing
          },
        ],
      },
      options: {
        animation: false,
        responsive: false, // control sizing manually
        maintainAspectRatio: false, // allow stretching to fill the row height
        scales: {
          x: {
            type: "linear",
            display: false,
            min: 0,
            max: width 
          },
          y: {
            display: false,
            // fixing y scale helps keeps the wave size consistent
            min: 0,
            max: 100 
          },
        },
        plugins: { legend: { display: false } },
      }
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [color, width]);

  // set up continuous scrolling animation at mm/sec (25 for ecg)
  useEffect(() => {
    let animationFrame: number;
    const pxPerFrame = pxPerSec / 60; // 60 fps
    let subPixel = 0;

    const animate = () => {
      const chart = chartRef.current;
      if (!chart) return;

      subPixel += pxPerFrame;

      // shift by 1 px when we need to
      while (subPixel >= 1) {
        subPixel -= 1;

        bufferRef.current.shift(); // shift to the right one pixel
        bufferRef.current.push(nextSample()); // add new sample
      }

      // update waveform dataset
      chart.data.datasets[0].data = bufferRef.current.map((y, x) => ({x, y}));
      chart.update("none");

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [width, mmPerSecond, nextSample]);

  return <canvas id={elementId} ref={canvasRef} height={height} width={width}/>;
}