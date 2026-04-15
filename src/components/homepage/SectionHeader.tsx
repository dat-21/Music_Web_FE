import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  href?: string;
  onSeeAll?: () => void;
}

const SectionHeader = ({ title, href = '#', onSeeAll }: SectionHeaderProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSeeAll?.();
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <h3
        style={{
          margin: 0,
          fontSize: 'var(--text-xl)',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h3>

      <a
        href={href}
        onClick={handleClick}
        className="inline-flex items-center gap-1.5"
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          transition: 'var(--transition-fast)',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.color = 'var(--color-accent-neon)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        See all
        <ArrowRight size={12} />
      </a>
    </div>
  );
};

export default SectionHeader;
