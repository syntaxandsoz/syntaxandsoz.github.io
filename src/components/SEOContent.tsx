import React from 'react';

interface SEOContentProps {
  title: string;
  content: React.ReactNode;
}

export default function SEOContent({ title, content }: SEOContentProps) {
  return (
    <section className="mt-12 pt-8 border-t border-[var(--foreground)]/20 prose prose-invert prose-green max-w-none">
      <h2 className="text-2xl font-bold mb-4 text-[var(--accent-blue)]">{title}</h2>
      <div className="text-sm opacity-80 leading-relaxed space-y-4">
        {content}
      </div>
    </section>
  );
}
