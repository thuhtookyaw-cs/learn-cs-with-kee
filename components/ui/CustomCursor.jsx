'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Create motion values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Create spring values for smooth trailing
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only show on desktop devices (non-touch)
        if (window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window)) return;

        setIsVisible(true);

        const moveCursor = (e) => {
            cursorX.set(e.clientX - 10);
            cursorY.set(e.clientY - 10);
        };

        const handleMouseOver = (e) => {
            // Check if hovering over clickable elements
            const isClickable = e.target.closest('a, button, input, select, textarea, [role="button"]');
            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
                position: 'fixed',
                top: 0,
                left: 0,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: isHovering ? 'var(--accent)' : 'var(--text-faint)',
                opacity: 0.4,
                pointerEvents: 'none',
                zIndex: 99999,
            }}
            animate={{
                scale: isHovering ? 2 : 1,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
    );
}
