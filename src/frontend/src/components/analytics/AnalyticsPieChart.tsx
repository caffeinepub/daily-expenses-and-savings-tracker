import { useMemo, useState } from 'react';
import { PieChartDataPoint } from '../../utils/analytics';
import { formatINR } from '../../utils/currency';
import { EntryType } from '../../backend';

interface AnalyticsPieChartProps {
  data: PieChartDataPoint[];
  type: EntryType;
}

const COLORS = [
  '#14b8a6', // teal
  '#f97316', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#10b981', // green
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#ef4444', // red
];

export default function AnalyticsPieChart({ data, type }: AnalyticsPieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top
    
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        color: COLORS[index % COLORS.length],
      };
    });
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-sm text-muted-foreground">
        No {type === EntryType.expense ? 'expense' : 'saving'} categories for this period
      </div>
    );
  }

  const createSlicePath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number, depth: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Outer arc points
    const x1 = 200 + outerRadius * Math.cos(startRad);
    const y1 = 200 + outerRadius * Math.sin(startRad);
    const x2 = 200 + outerRadius * Math.cos(endRad);
    const y2 = 200 + outerRadius * Math.sin(endRad);
    
    // Inner arc points
    const x3 = 200 + innerRadius * Math.cos(endRad);
    const y3 = 200 + innerRadius * Math.sin(endRad);
    const x4 = 200 + innerRadius * Math.cos(startRad);
    const y4 = 200 + innerRadius * Math.sin(startRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    // Top surface
    const topPath = `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
    
    // Side surfaces for 3D effect
    const sidePaths: string[] = [];
    
    // Only show sides for slices in the bottom half (3D depth effect)
    if (startAngle < 90 || endAngle > 90) {
      // Outer edge depth
      const outerDepthPath = `
        M ${x1} ${y1}
        L ${x1} ${y1 + depth}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2 + depth}
        L ${x2} ${y2}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x1} ${y1}
        Z
      `;
      sidePaths.push(outerDepthPath);
    }
    
    return { topPath, sidePaths };
  };

  const centerX = 200;
  const centerY = 200;
  const outerRadius = 120;
  const innerRadius = 50;
  const depth = 15;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* 3D Pie Chart */}
        <div className="flex-1 flex justify-center">
          <svg
            viewBox="0 0 400 420"
            className="w-full max-w-md h-auto pie-chart-3d"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          >
            <defs>
              {chartData.map((item, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={item.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={item.color} stopOpacity="0.7" />
                </linearGradient>
              ))}
            </defs>
            
            {/* Draw depth/shadow layers first */}
            {chartData.map((item, index) => {
              const { sidePaths } = createSlicePath(item.startAngle, item.endAngle, outerRadius, innerRadius, depth);
              const isHovered = hoveredIndex === index;
              const offset = isHovered ? 8 : 0;
              const midAngle = (item.startAngle + item.endAngle) / 2;
              const offsetX = offset * Math.cos((midAngle * Math.PI) / 180);
              const offsetY = offset * Math.sin((midAngle * Math.PI) / 180);
              
              return (
                <g key={`depth-${index}`} transform={`translate(${offsetX}, ${offsetY})`}>
                  {sidePaths.map((path, i) => (
                    <path
                      key={`side-${i}`}
                      d={path}
                      fill={item.color}
                      opacity="0.5"
                      style={{ filter: 'brightness(0.7)' }}
                    />
                  ))}
                </g>
              );
            })}
            
            {/* Draw top surfaces */}
            {chartData.map((item, index) => {
              const { topPath } = createSlicePath(item.startAngle, item.endAngle, outerRadius, innerRadius, depth);
              const isHovered = hoveredIndex === index;
              const offset = isHovered ? 8 : 0;
              const midAngle = (item.startAngle + item.endAngle) / 2;
              const offsetX = offset * Math.cos((midAngle * Math.PI) / 180);
              const offsetY = offset * Math.sin((midAngle * Math.PI) / 180);
              
              // Calculate label position
              const labelRadius = (outerRadius + innerRadius) / 2;
              const labelX = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180) + offsetX;
              const labelY = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180) + offsetY;
              
              return (
                <g
                  key={`slice-${index}`}
                  transform={`translate(${offsetX}, ${offsetY})`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  <path
                    d={topPath}
                    fill={`url(#gradient-${index})`}
                    stroke="white"
                    strokeWidth="2"
                    opacity={isHovered ? 1 : 0.95}
                  />
                  {item.percentage > 5 && (
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-semibold fill-white"
                      style={{ 
                        pointerEvents: 'none',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                      }}
                    >
                      {item.percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex-shrink-0 w-full lg:w-64 space-y-2">
          {chartData.map((item, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-muted/50"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                backgroundColor: hoveredIndex === index ? 'oklch(var(--muted))' : 'transparent',
              }}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.category}</div>
                <div className="text-xs text-muted-foreground">
                  {formatINR(item.value)} ({item.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
