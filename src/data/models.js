// Lazy-load model data using Vite's import.meta.glob
// Only the requested model's file is actually loaded at runtime.
const modelModules = import.meta.glob('./model-records/*.js');

// Manual overrides for files where `${brandSlug}-${modelSlug}` doesn't match
// the actual filename. This happens when brandSlug contains hyphens that
// overlap with the modelSlug prefix (e.g. mercedes-amg / amg-gt3).
const FILENAME_OVERRIDES = {
  'mercedes-amg:amg-gt3': 'mercedes-amg-gt3',
  'mercedes-amg:amg-gt-black-series': 'mercedes-amg-gt-black-series',
  'mercedes-amg:amg-gt-r': 'mercedes-amg-gt-r',
  'mercedes-amg:amg-one': 'mercedes-amg-one',
};

export async function getModelByBrandAndSlug(brandSlug, modelSlug) {
  const key = `${brandSlug}:${modelSlug}`;
  const basename = FILENAME_OVERRIDES[key] ?? `${brandSlug}-${modelSlug}`;
  const path = `./model-records/${basename}.js`;
  const loader = modelModules[path];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
