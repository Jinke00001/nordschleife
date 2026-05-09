import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CornerCard from '../components/CornerCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import TrackMap from '../components/TrackMap.jsx';
import OptimizedImage from '../components/OptimizedImage.jsx';
import karussellHero from '../assets/karussell-wikimedia-1800.jpg';
import { brands } from '../data/brands.js';
import { corners, featuredCornerSlugs } from '../data/corners.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useParallax from '../hooks/useParallax.js';
import useTilt3D from '../hooks/useTilt3D.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const featuredCorners = featuredCornerSlugs.map((slug) => corners.find((corner) => corner.slug === slug));

export default function HomePage() {
  useDocumentTitle('首页');
  useScrollReveal();
  const heroBgRef = useParallax(0.18);
  useTilt3D('.brand-badge', 5);
  useTilt3D('.corner-card', 5);
  const scrollToMap = () => {
    document.getElementById('home-track-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="hero">
        <img ref={heroBgRef} className="hero-bg-image parallax-img" src={karussellHero} alt="纽博格林北环 Karussell 弯角" />

        <div className="hero-copy">
          <h1>走进绿色地狱</h1>
          <p>
            70 多个弯角，从 Flugplatz 的起飞到 Döttinger Höhe 的全油门——每个都有自己的名字、
            地形和故事。这里整理了弯角的来历、驾驶要点与赛道记忆。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/corners">
              探索弯角 <ArrowRight size={18} />
            </Link>
            <button className="ghost-button" type="button" onClick={scrollToMap}>
              查看赛道地图
            </button>
          </div>
        </div>

        <span className="hero-location">50.3359°N · 6.9470°E · Eifel, DE</span>
        <p className="hero-photo-credit">Karussell · Wikimedia Commons · CC0</p>
      </section>

      <div className="atmosphere-banner">
        <OptimizedImage basename="atmosphere-forest" alt="" loading="lazy" decoding="async" />
        <div className="atmosphere-banner-overlay" />
      </div>

      <section className="map-exhibit reveal-on-scroll" id="home-track-map">
        <div className="map-exhibit-copy">
          <p className="eyebrow">Track Map</p>
          <h2>先看清这条"森林长卷"的真实形状</h2>
          <p>
            赛道图不是装饰，而是进入北环的第一张索引。红色进度沿赛道巡游，弯名按钮连接到对应故事页：
            从 Flugplatz 的车身变轻，到 Karussell 的水泥槽，再到 Döttinger Höhe 的全油门长直道。
          </p>
        </div>
        <TrackMap />
      </section>

      <section className="page-section reveal-on-scroll">
        <SectionHeader eyebrow="Corner Gallery" title="先认识这些著名弯角">
          从飞行场到长直道，这些名字构成了许多人认识北环的路线图。
        </SectionHeader>
        <div className="card-grid featured-grid">
          {featuredCorners.map((corner) => (
            <CornerCard key={corner.slug} corner={corner} compact />
          ))}
        </div>
      </section>

      <div className="atmosphere-banner">
        <OptimizedImage basename="atmosphere-dusk" alt="" loading="lazy" decoding="async" />
        <div className="atmosphere-banner-overlay" />
      </div>

      <section className="page-section reveal-on-scroll">
        <SectionHeader eyebrow="弯角之外" title="品牌登场">
          弯角记住了速度，品牌记住了性格。从耐力赛工程到日常性能，从超跑戏剧到玩家记忆。
        </SectionHeader>
        <div className="brand-badge-grid">
          {brands.map((brand) => {
            const darkLogos = new Set(['amg', 'lexus', 'volkswagen']);
            const logoDir = darkLogos.has(brand.logoBasename) ? 'logos' : 'logos/color';
            return (
              <Link className="brand-badge" to={`/brands/${brand.slug}`} key={brand.slug} aria-label={brand.name}>
                <img className="brand-badge-logo" src={`/${logoDir}/${brand.logoBasename}.svg`} alt={brand.name} />
              </Link>
            );
          })}
        </div>
        <Link className="primary-button brand-cta" to="/brands">
          查看全部品牌 <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
