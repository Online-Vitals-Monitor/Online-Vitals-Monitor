import {useEffect} from "react";
import {LineChart, Interpolation} from "chartist";

type WaveformChartProps = {
  elementId: string;   // DOM id of div
  data: number[];     // array of y-values 
  color: string;
  height: number; 
};

// NO ANIMATION FOR NOW, JUST STATIC
export default function WaveformChart({
  elementId,
  data,
  color,
  height = 140,
}: WaveformChartProps) {
  useEffect(() => {
    const chartOptions = {
      height,
      showPoint: false,
      fullWidth: true,
      lineSmooth: Interpolation.monotoneCubic(), // makes it smooth like a monitor trace
      chartPadding: 0,
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        showLabel: false,
        offset: 0,
        low: 0,
        high: 100, 
      },
    };

    const chart = new LineChart(
      "#" + elementId,
      { // no labels, single line
        labels: [],  
        series: [data], 
      },
      chartOptions
    );

    // after Chartist injects the SVG, color the line
    setTimeout(() => {
      const lineEl = document.querySelector(
        `#${elementId} .ct-series-a .ct-line`
      ) as SVGPathElement | null;

      if (lineEl) {
        lineEl.style.stroke = color;
        lineEl.style.strokeWidth = "2px";
      }
    }, 0);

    // cleaning up old Chartist instance
    return () => {
      (chart as any)?.detach?.();
    };
  }, [elementId, data, color, height]);

  return null;
}
