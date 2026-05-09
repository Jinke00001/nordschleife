import { useCallback, useRef, useEffect } from 'react';

/**
 * useMagnetic Hook
 * Adds a subtle magnetic pull effect to an element based on mouse proximity.
 * @param {number} strength - How strongly the element is pulled (default: 0.3)
 * @param {number} radius - Proximity radius in pixels (default: 80)
 */
export default function useMagnetic(strength = 0.3, radius = 80) {
  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < radius) {
        // Apply magnetic pull
        const pullX = deltaX * strength;
        const pullY = deltaY * strength;
        ref.current.style.transform = `translate(${pullX}px, ${pullY}px)`;
      } else {
        // Reset
        ref.current.style.transform = 'translate(0px, 0px)';
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return {
    ref,
    onMouseLeave: handleMouseLeave,
    style: {
      transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      display: 'inline-block', // Ensure transform works
    },
  };
}
