import { useMemo, useId } from 'react';

const gaussian = (x, mean = 0.5, sigma = 0.15) =>
    Math.exp(-((x - mean) ** 2) / (2 * sigma ** 2));

function DashedGradientLine({
    start = { x: 0, y: 0.5 },
    end = { x: 1, y: 0.5 },
    colors = ['#71B432', '#0091D1', '#CCB502'],
    minDashWidth = 3,
    maxDashWidth = 14,
    dashHeight = 20,
    gap = 4,
    sigma = 0.18,
    screenWidth = 400,
    screenHeight = 100,
}) {
    const x1 = start.x * screenWidth;
    const y1 = start.y * screenHeight;
    const x2 = end.x * screenWidth;
    const totalLength = x2 - x1;
    const uid = useId();
    const gradientId = `dashed-grad-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
    const maskId = `dash-mask-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

    const avgStep = (minDashWidth + maxDashWidth) / 2 + gap;
    const count = Math.floor(totalLength / avgStep);

    const dashes = useMemo(() => {
        const items = Array.from({ length: count }, (_, i) => {
            const progress = i / (count - 1);
            const scale = gaussian(progress, 0.5, sigma);
            const width = minDashWidth + (maxDashWidth - minDashWidth) * scale;
            return { width, progress };
        });

        let cursor = x1;
        return items.map((d) => {
            const x = cursor;
            cursor += d.width + gap;
            return { x, width: d.width };
        });
    }, [count, x1, minDashWidth, maxDashWidth, gap, sigma]);

    return (
        <svg
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
            width={screenWidth}
            height={screenHeight}
        >
            <defs>
                <linearGradient
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    x1={x1} y1={y1}
                    x2={x2} y2={y1}
                >
                    {colors.map((color, i) => (
                        <stop
                            key={i}
                            offset={`${(i / (colors.length - 1)) * 100}%`}
                            stopColor={color}
                        />
                    ))}
                </linearGradient>
                <mask id={maskId}>
                    {dashes.map((d, i) => (
                        <rect
                            key={i}
                            x={d.x}
                            y={y1 - dashHeight / 2}
                            width={d.width}
                            height={dashHeight}
                            rx={0}
                            fill="white"
                        />
                    ))}
                </mask>
            </defs>

            <rect
                x={x1}
                y={y1 - dashHeight / 2}
                width={totalLength}
                height={dashHeight}
                fill={`url(#${gradientId})`}
                mask={`url(#${maskId})`}
            />
        </svg>
    );
}

export default DashedGradientLine;