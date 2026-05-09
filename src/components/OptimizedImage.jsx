// Build-time glob of optimized image assets for format-aware serving.
const avifSources = import.meta.glob('/src/assets/**/*.avif', {
  eager: true,
  query: '?url',
  import: 'default'
});
const webpSources = import.meta.glob('/src/assets/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
});
const jpgSources = import.meta.glob('/src/assets/**/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default'
});

const avifByBasename = {};
const webpByBasename = {};
const jpgByBasename = {};

for (const entry of Object.entries(avifSources)) {
  const name = entry[0].split('/').pop().replace(/\.avif$/, '');
  avifByBasename[name] = entry[1];
}
for (const entry of Object.entries(webpSources)) {
  const name = entry[0].split('/').pop().replace(/\.webp$/, '');
  webpByBasename[name] = entry[1];
}
for (const entry of Object.entries(jpgSources)) {
  const name = entry[0].split('/').pop().replace(/\.jpg$/, '');
  jpgByBasename[name] = entry[1];
}

export { avifByBasename, webpByBasename, jpgByBasename };

export default function OptimizedImage({ basename, alt, className, style, ...rest }) {
  const avifSrc = avifByBasename[basename];
  const webpSrc = webpByBasename[basename];
  const jpgSrc = jpgByBasename[basename];

  if (!jpgSrc) {
    console.warn(`[OptimizedImage] No JPG found for basename: ${basename}`);
    return null;
  }

  return (
    <picture>
      {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={jpgSrc}
        alt={alt}
        className={className}
        style={style}
        {...rest}
      />
    </picture>
  );
}
