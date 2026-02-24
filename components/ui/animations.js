'use client';

import { motion } from 'framer-motion';

export function FadeIn({ children, delay = 0, className = '', style = {} }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export function HoverLift({ children, className = '', style = {} }) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
