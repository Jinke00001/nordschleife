import { useEffect } from 'react';

/**
 * useTilt3D
 * Applies a subtle 3D perspective tilt effect to all elements matching `selector`
 * on mouse-move. Uses CSS custom properties for GPU-composited transforms.
 * Respects prefers-reduced-motion.
 *
 * @param {string} selector  – CSS selector for tiltable elements
 * @param {number} maxDeg    – Max rotation degrees (default 6)
 */
export default function useTilt3D(selector = '.corner-card, .brand-badge', maxDeg = 6) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return;

    const handlers = elements.map((el) => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * maxDeg;
        const rotY = dx * maxDeg;
        el.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.03,1.03,1.03)`;
      };

      const onLeave = () => {
        el.style.transform = '';
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return { el, onMove, onLeave };
    });

    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [selector, maxDeg]);
}
