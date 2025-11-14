import React, { useEffect, useRef, useMemo } from "react";
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
};

export default function WaveformChart({ 
  elementId,
  beatData,
  color,
  height,
  easing = "Power2.inOut",
  waveformType = "ecg",
  width,
  mmPerSecond = 25,
}: WaveformChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // drawn in canvas
  const chartRef = useRef<Chart | null>(null); // chart instance
  // const offsetRef = useRef<number>(0);

  // set up rolling buffer
  const bufferRef = useRef<number[]>([]); // set up buffer for waveform
  useEffect(() => {
    bufferRef.current = new Array(width).fill(0)
  }, [width]);

  // set up one single beat
  const beat = useMemo(() => beatData, [beatData]);
  let beatIndex = 0;

  // generate the next beat
  const nextSample = () => {
    const s = beat[beatIndex];
    beatIndex = (beatIndex + 1) % beat.length;
    return s;
  }

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
            data: bufferRef.current.map((y, x) => ({x, y})), // create linear x positions in the buffer
            borderColor: color,
            borderWidth: 2,
            pointRadius: 0,
            spanGaps: false, // prevents GSAP from connecting the last point to the first point
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: {
            type: "linear",
            display: false,
            min: 0,
            max: width // change to width of window
          },
          y: {
            display: false
          },
        },
        plugins: { legend: { display: false } },
      }
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [color, waveformType, width]);

  // set up continuous scrolling animation at mm/sec (25 for ecg)
  useEffect(() => {
    let animationFrame: number;

    const pxPerMm = 3.78; // general monitor pixel desnity
    const pxPerSec = mmPerSecond * pxPerMm; // generate the correct number of pixels / second based on the waveform speed
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
  }, [width, mmPerSecond]);

  // // easing functions
  // useEffect(() => {
  //   gsap.to(speedRef, {
  //     duration: 1.0,
  //     current: speed,
  //     ease: easing,
  //   });
  // }, [speed, easing])

  return <canvas id={elementId} ref={canvasRef} height={height} width={width}/>;
}