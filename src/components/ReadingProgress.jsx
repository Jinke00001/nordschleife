import { useEffect, useState } from 'react';

/**
 * ReadingProgress — a thin red bar at the top of the viewport
 * that fills as the user scrolls through the page.
 * Only visible when the page is scrollable (scrollHeight > 2 * innerHeight).
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= window.innerHeight) {
        setVisible(false);
        return;
      }
      setVisible(true);
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="页面阅读进度"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="reading-progress-bar"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
