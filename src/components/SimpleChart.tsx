import React from 'react';

interface SimpleChartProps {
  data: number[];
  labels?: string[];
  title?: string;
  type?: 'line' | 'bar';
  color?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  labels, 
  title, 
  type = 'line',
  color = '#50957d' 
}) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    return range === 0 ? 50 : ((value - minValue) / range) * 100;
  };

  const getLineY = (value: number, index: number) => {
    const height = getBarHeight(value);
    return 100 - height;
  };

  return (
    <div className="w-full h-64 bg-gradient-to-br from-card to-primary/5 rounded-lg p-4 border border-border/50">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <div className="relative w-full h-48">
        {type === 'bar' ? (
          <div className="flex items-end justify-between h-full space-x-1">
            {data.map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${getBarHeight(value)}%`,
                    backgroundColor: color,
                    minHeight: '4px'
                  }}
                />
                {labels && (
                  <span className="text-xs text-muted-foreground mt-2 text-center">
                    {labels[index]}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              points={data.map((value, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = getLineY(value, index);
                return `${x},${y}`;
              }).join(' ')}
            />
            {data.map((value, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = getLineY(value, index);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1"
                  fill={color}
                />
              );
            })}
          </svg>
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{minValue.toLocaleString()}</span>
        <span>{maxValue.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default SimpleChart;
