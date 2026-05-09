import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    const observeRevealElements = () => {
      document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach((el) => {
        observer.observe(el);
      });
    };

    // Initial pass after DOM settles
    const timeoutId = setTimeout(observeRevealElements, 100);

    // Watch for dynamically added elements (e.g. async-loaded model data)
    const mutationObserver = new MutationObserver(() => {
      observeRevealElements();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Also re-observe on scroll in case IntersectionObserver missed elements
    // (e.g. elements already in view when observer was created)
    const scrollHandler = () => observeRevealElements();
    window.addEventListener('scroll', scrollHandler, { passive: true, once: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);
}
