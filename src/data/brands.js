import { brandRecords } from './brand-records/index.js';

function createDefaultBrandResources(brand) {
  return [
    {
      id: `${brand.slug}-model-photos`,
      type: 'photo',
      label: 'Photo',
      title: `${brand.name} 代表车型图片`,
      description: '官方图片、赛事照片或历史影像，可用于呈现品牌车型的视觉记忆。'
    },
    {
      id: `${brand.slug}-lap-story`,
      type: 'article',
      label: 'Story',
      title: `${brand.name} 圈速故事资料`,
      description: '车型年份、圈速背景、车手或测试背景，适合用来解释数字背后的故事。'
    },
    {
      id: `${brand.slug}-video`,
      type: 'video',
      label: 'Video',
      title: `${brand.name} 影像资料`,
      description: '品牌官方短片、纽北测试片段或赛事回顾，可用于补充车型叙事。'
    }
  ];
}

export const brands = brandRecords.map((brand) => ({
  resources: createDefaultBrandResources(brand),
  ...brand
}));

export function getBrandBySlug(slug) {
  return brands.find((brand) => brand.slug === slug);
}

export function getAdjacentBrands(slug) {
  const index = brands.findIndex((brand) => brand.slug === slug);

  return {
    previous: index > 0 ? brands[index - 1] : null,
    next: index >= 0 && index < brands.length - 1 ? brands[index + 1] : null
  };
}
