import { useEffect } from 'react';

/**
 * useDocumentTitle Hook
 * Dynamically updates the document title.
 * @param {string} title - The title to display
 * @param {boolean} prefix - Whether to add the site name as a suffix
 */
export default function useDocumentTitle(title, suffix = '走进绿色地狱') {
  useEffect(() => {
    const baseTitle = '纽博格林北环弯角故事';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
}
