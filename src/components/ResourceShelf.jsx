import { BookOpen, ExternalLink, Image, Video } from 'lucide-react';

const resourceIcons = {
  photo: Image,
  video: Video,
  article: BookOpen,
  source: ExternalLink
};

export default function ResourceShelf({ resources, title = '资料接入位' }) {
  if (!resources?.length) {
    return null;
  }

  return (
    <section className="resource-shelf" aria-label={title}>
      <div className="resource-shelf-heading">
        <p className="eyebrow">Archive Dock</p>
        <h2>{title}</h2>
      </div>
      <div className="resource-grid">
        {resources.map((resource) => {
          const Icon = resourceIcons[resource.type] || ExternalLink;
          const content = (
            <>
              <Icon size={18} />
              <span>{resource.label}</span>
              <strong>{resource.title}</strong>
              <p>{resource.description}</p>
            </>
          );

          return resource.href ? (
            <a className="resource-card" href={resource.href} key={resource.id} rel="noreferrer" target="_blank">
              {content}
            </a>
          ) : (
            <article className="resource-card is-placeholder" key={resource.id}>
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
