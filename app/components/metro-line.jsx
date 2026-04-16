import { useMemo } from 'react';

const buildMetroLine = (startPoint, endPoint, cornerRadius = 16, midRatio = 0.5) => {
    const midX = startPoint.x + (endPoint.x - startPoint.x) * midRatio;
    const dy = startPoint.y > endPoint.y ? -1 : 1;
    const r = Math.min(cornerRadius, Math.abs(endPoint.x - midX), Math.abs(endPoint.y - startPoint.y) / 2);

    return [
        `M ${startPoint.x} ${startPoint.y}`,
        `H ${midX - r}`,
        `Q ${midX} ${startPoint.y} ${midX} ${startPoint.y + dy * r}`,
        `V ${endPoint.y - dy * r}`,
        `Q ${midX} ${endPoint.y} ${midX + r} ${endPoint.y}`,
        `H ${endPoint.x}`,
    ].join(' ');
}

const scale = (point, screenWidth, screenHeight) => {
    return {
        x: point.x * screenWidth,
        y: point.y * screenHeight,
    }
}

function MetroLine({
    start = { x: 0, y: 0 },
    end = { x: 0, y: 0 },
    colors,
    cornerRadius = 16,
    midRatio = 0.5,
    screenWidth = 0,
    screenHeight = 0,
}) {

    const scaledStart = scale(start, screenWidth, screenHeight);
    const scaledEnd = scale(end, screenWidth, screenHeight);
    const pathData = buildMetroLine(scaledStart, scaledEnd, cornerRadius, midRatio);
    const gradientId = useMemo(
        () => `metro-grad-${colors.join('-').replace(/[^a-zA-Z0-9]/g, '')}`,
        [colors]
    );
    const useGradient = colors.length > 1;
    const stroke = useGradient ? `url(#${gradientId})` : colors[0];

    return (
        <svg
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
            width={screenWidth}
            height={screenHeight}
        >
            {useGradient && (
                <defs>
                    <linearGradient
                        id={gradientId}
                        gradientUnits="userSpaceOnUse"
                        x1={scaledStart.x} y1={scaledStart.y}
                        x2={scaledEnd.x} y2={scaledEnd.y}
                    >
                        {colors.map((color, i) => (
                            <stop
                                key={i}
                                offset={`${(i / (colors.length - 1)) * 100}%`}
                                stopColor={color}
                            />
                        ))}
                    </linearGradient>
                </defs>
            )}

            <path
                d={pathData}
                fill="none"
                stroke={stroke}
                strokeWidth={8}
                strokeLinecap="round"
            />
        </svg>
    );
}
export default MetroLine;