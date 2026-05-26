import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationControls } from 'motion/react';

interface AnimatedNumberProps {
  endValue: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedNumber({ endValue, suffix = '', prefix = '', duration = 2000 }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const controls = useAnimationControls();
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startTime: number | null = null;
    let animationFrame: number;
    let hasStarted = false;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const MathMin = Math.min(progress / duration, 1);
      
      // EaseOut function for smoother deceleration
      const easeOut = 1 - Math.pow(1 - MathMin, 4);
      setCount(Math.floor(easeOut * endValue));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          hasStarted = true;
          animationFrame = requestAnimationFrame(animateCount);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [endValue, duration]);

  const triggerEffect = () => {
    if (isInteracting) return;
    setIsInteracting(true);
    
    // Physical spring bounce animation
    controls.start({
      y: -15,
      scale: 1.15,
      transition: { type: "spring", stiffness: 200, damping: 12 }
    }).then(() => {
      controls.start({
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 150, damping: 18 }
      });
    });

    // Value scrambling effect (springing numbers)
    let iterations = 0;
    const interval = setInterval(() => {
      iterations++;
      if (iterations >= 15) {
        clearInterval(interval);
        setCount(endValue);
        setIsInteracting(false);
      } else {
        const strVal = Math.floor(endValue).toString();
        let randomStr = '';
        for (let i = 0; i < strVal.length; i++) {
          randomStr += Math.floor(Math.random() * 10).toString();
        }
        setCount(parseInt(randomStr, 10));
      }
    }, 80);
  };

  return (
    <motion.span 
      ref={ref} 
      animate={controls}
      onMouseEnter={triggerEffect}
      onTouchStart={triggerEffect}
      className="inline-block cursor-default select-none"
    >
      {prefix}{count}{suffix}
    </motion.span>
  );
}
