import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface LoadingIndicatorProps {
    minimumDuration?: number;
    isLoading: boolean;
    children: React.ReactNode;
    portalTarget?: HTMLElement;
    className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
                                                               minimumDuration = 3000,
                                                               isLoading,
                                                               children,
                                                               portalTarget,
                                                               className = ''
                                                           }) => {
    const [shouldShow, setShouldShow] = useState(isLoading);
    const dotRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const frameRef = useRef<number>();
    const startTimeRef = useRef<number>();

    // Animation state
    const positionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const lastFrameRef = useRef(performance.now());

    const timeRef = useRef(0);
    const radiusRef = useRef({ x: 50, y: 30 }); // Base radius of loops
    const frequencyRef = useRef({ x: 1, y: 1.3 }); // Different frequencies create figure-8s
    const phaseRef = useRef({ x: 0, y: Math.PI / 4 }); // Phase offset for more natural motion

    const SPEED = 3;

    useEffect(() => {
        if (isLoading) {
            startTimeRef.current = Date.now();
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


    const animate = React.useCallback((time: number) => {
        if (!dotRef.current || !containerRef.current) return;

        const deltaTime = (time - lastFrameRef.current) / 16;
        lastFrameRef.current = time;

        // Use SPEED to control how fast time increments
        timeRef.current += deltaTime * SPEED * 0.02;

        // Rest of animation logic stays the same...
        const bounds = containerRef.current.getBoundingClientRect();
        const centerX = 0;
        const centerY = 0;

        // Scale the radius variations by speed as well
        radiusRef.current.x += (Math.random() - 0.5) * 0.5 * SPEED;
        radiusRef.current.y += (Math.random() - 0.5) * 0.5 * SPEED;
        radiusRef.current.x = Math.max(30, Math.min(70, radiusRef.current.x));
        radiusRef.current.y = Math.max(20, Math.min(50, radiusRef.current.y));

        frequencyRef.current.x += (Math.random() - 0.5) * 0.001;
        frequencyRef.current.y += (Math.random() - 0.5) * 0.001;

        // Calculate base circular motion
        const baseX = Math.cos(timeRef.current * frequencyRef.current.x + phaseRef.current.x) * radiusRef.current.x;
        const baseY = Math.sin(timeRef.current * frequencyRef.current.y + phaseRef.current.y) * radiusRef.current.y;

        // Add some randomness to the position
        const randomX = (Math.random() - 0.5) * 2;
        const randomY = (Math.random() - 0.5) * 2;

        // Combine circular motion with slight randomness
        positionRef.current.x = centerX + baseX + randomX;
        positionRef.current.y = centerY + baseY + randomY;

        // Gradually shift the phase for changing loop patterns
        phaseRef.current.x += Math.random() * 0.001;
        phaseRef.current.y += Math.random() * 0.001;

        // Add subtle acceleration in the direction of motion
        velocityRef.current.x = (positionRef.current.x - centerX) * 0.01;
        velocityRef.current.y = (positionRef.current.y - centerY) * 0.01;

        // Boundary checks (keep the same)
        if (Math.abs(positionRef.current.x) > bounds.width / 2) {
            positionRef.current.x = Math.sign(positionRef.current.x) * bounds.width / 2;
            phaseRef.current.x += Math.PI / 2; // Change pattern on boundary hit
        }
        if (Math.abs(positionRef.current.y) > bounds.height / 2) {
            positionRef.current.y = Math.sign(positionRef.current.y) * bounds.height / 2;
            phaseRef.current.y += Math.PI / 2; // Change pattern on boundary hit
        }

        // Apply transform with hardware acceleration
        dotRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;

        frameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (shouldShow) {
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
            <div
                ref={dotRef}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-info opacity-80 shadow-lg"
                style={{
                    filter: 'blur(1px)',
                    willChange: 'transform'
                }}
            />
        </div>
    );

    if (shouldShow) {
        // Only render the loader while loading, don't render children at all
        return portalTarget ? createPortal(loader, portalTarget) : loader;
    }

    // Only render children when loading is complete AND minimum duration has elapsed
    return children;
};

export default LoadingIndicator;