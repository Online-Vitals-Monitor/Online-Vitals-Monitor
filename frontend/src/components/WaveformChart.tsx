import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { gsap } from "gsap"; // for smooth easing and sync with API

// set chart type/components and expected values to recieve
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

type WaveformChartProps = {
  elementId: string;
  data: number[];
  color: string;
  height: number;
  speed?: number; // how fast it scrolls
  easing?: string; // GSAP easing name
  waveformType?: "ecg"; // add | "other options" | in the future 
  width: number;
};

export default function WaveformChart({ 
  elementId,
  data,
  color,
  height,
  speed = 10,
  easing = "Power2.inOut",
  waveformType = "ecg",
  width,
}: WaveformChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // drawn in canvas
  const chartRef = useRef<Chart | null>(null); // chart instance
  const speedRef = useRef<number>(speed);
  const offsetRef = useRef<number>(0);

  // set up the chart
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((_, i) => i),
        datasets: [
          {
            data,
            borderColor: color,
            borderWidth: 2,
            // tension: waveformType === "pleth" ? 0.6 : 0.4, // smoother for pleth
            pointRadius: 0,
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: { legend: { display: false } },
      }
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, color, waveformType]);

  // set up continuous scrolling animation
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      const chart = chartRef.current;
      if (!chart) return;

      offsetRef.current = (offsetRef.current + speedRef.current) % data.length;
      const shifted = [
        ...data.slice(offsetRef.current),
        ...data.slice(0, offsetRef.current),
      ];
      chart.data.datasets[0].data = shifted;
      chart.update();

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [data]);

  // easing functions
  useEffect(() => {
    gsap.to(speedRef, {
      duration: 1.0,
      value: speed,
      ease: easing,
    });
  }, [speed, easing])

  return <canvas id={elementId} ref={canvasRef} height={height} width={width || 600}/>;
}