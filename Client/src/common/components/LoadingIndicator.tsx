import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface LoadingIndicatorProps {
    minimumDuration?: number;
    isLoading: boolean;
    children: React.ReactNode;
    portalTarget?: HTMLElement;
    className?: string;
    ContainerComponent?: React.ComponentType<{
        children: React.ReactNode;
        loader: React.ReactNode;
        isLoading: boolean;
    }>;
}

function LoadingIndicator(props: LoadingIndicatorProps) {

    const {
        minimumDuration = 3000,
        isLoading,
        children,
        portalTarget,
        className = '',
        ContainerComponent
    } = props;

    const [shouldShow, setShouldShow] = useState(isLoading);
    const electronRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const frameRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const initialTimeRef = useRef<number>();

    // Atomic parameters
    const ORBIT_RADIUS = 90;
    const ORBIT_SPEED = 0.001;
    const ELLIPSE_RATIO = 0.3;

    // Define three distinct orbital planes
    const ORBITS = [
        // Horizontal orbit
        { angle: 0 },
        // Tilted orbits to create atomic symbol
        { angle: 120 },
        { angle: 240 }
    ];

    useEffect(() => {
        if (isLoading) {
            startTimeRef.current = Date.now();
            initialTimeRef.current = performance.now();
            setShouldShow(true);
        } else if (startTimeRef.current) {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remainingTime = Math.max(0, minimumDuration - elapsedTime);

            timeoutRef.current = setTimeout(() => {
                setShouldShow(false);
            }, remainingTime);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isLoading, minimumDuration]);

    const animate = React.useCallback((timestamp: number) => {
        if (!containerRef.current || !initialTimeRef.current) return;

        const elapsedTime = timestamp - initialTimeRef.current;

        electronRefs.current.forEach((electronRef, index) => {
            if (!electronRef) return;

            const t = elapsedTime * ORBIT_SPEED;
            const orbitAngle = (ORBITS[index].angle * Math.PI) / 180;

            // Calculate base circular motion
            const baseX = Math.cos(t) * ORBIT_RADIUS;
            const baseY = Math.sin(t) * ORBIT_RADIUS * ELLIPSE_RATIO;

            // Rotate around Y axis to create the atomic symbol pattern
            const x = baseX * Math.cos(orbitAngle) - baseY * Math.sin(orbitAngle);
            const y = baseY * Math.cos(orbitAngle) + baseX * Math.sin(orbitAngle);

            electronRef.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
        });

        frameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (shouldShow) {
            initialTimeRef.current = performance.now();
            frameRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [shouldShow, animate]);

    if (!shouldShow) {
        return children;
    }

    const loader = (
        <div
            ref={containerRef}
            className={`relative w-full h-full min-h-64 overflow-hidden ${className}`}
            style={{ perspective: '1000px' }}
        >
            {/* Nucleus */}
            <div
                className="absolute left-1/2 top-1/2 w-5 h-5 -ml-2.5 -mt-2.5 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(14,165,233,0.7) 0%, rgba(14,165,233,0.3) 70%, rgba(14,165,233,0) 100%)',
                    filter: 'blur(1px)'
                }}
            />

            {/* Electrons */}
            {[0, 1, 2].map((i) => (
                <div
                    key={`electron-${i}`}
                    ref={el => electronRefs.current[i] = el}
                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-info"
                    style={{
                        filter: 'blur(0.5px)',
                        willChange: 'transform',
                        boxShadow: '0 0 8px rgba(14,165,233,0.5)'
                    }}
                />
            ))}
        </div>
    );

    const content = portalTarget ? createPortal(loader, portalTarget) : loader;

    return ContainerComponent ? (
        <ContainerComponent loader={content} isLoading={isLoading}>
            {children}
        </ContainerComponent>
    ) : content;
}

export default LoadingIndicator;