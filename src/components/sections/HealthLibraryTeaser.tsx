// Health Library Teaser — editorial magazine layout

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { SectionHeader, Badge } from '@/components/ui';
import { ROUTES } from '@/config/constants';

const ARTICLES = [
  {
    id: '1',
    slug: 'understanding-heart-disease-risk',
    title: 'Understanding your heart disease risk',
    excerpt: 'Simple steps that can make a real difference to your heart health.',
    category: 'Cardiology',
    readTime: 5,
    isReviewed: true,
    reviewer: 'Dr. Priya Sharma',
    featured: true,
  },
  {
    id: '2',
    slug: 'knee-pain-when-to-see-doctor',
    title: 'Knee pain: when is it time to see a specialist?',
    excerpt: 'Not all knee pain needs surgery. Here\'s how to know when to get it checked.',
    category: 'Orthopedics',
    readTime: 4,
    isReviewed: true,
    reviewer: 'Dr. Rajesh Kulkarni',
    featured: false,
  },
  {
    id: '3',
    slug: 'child-fever-guide-parents',
    title: 'A parent\'s guide to fever in children',
    excerpt: 'What\'s normal, what to watch for, and when to call the doctor.',
    category: 'Pediatrics',
    readTime: 6,
    isReviewed: true,
    reviewer: 'Dr. Ananya Joshi',
    featured: false,
  },
  {
    id: '4',
    slug: 'skin-care-monsoon',
    title: 'Protecting your skin in monsoon season',
    excerpt: 'Humidity and rain bring specific skin challenges. Here\'s what works.',
    category: 'Dermatology',
    readTime: 3,
    isReviewed: false,
    reviewer: null,
    featured: false,
  },
];

export function HealthLibraryTeaser() {
  const featured = ARTICLES.find(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);

  return (
    <section className="section-padding bg-paper" aria-label="Health Library">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader
            eyebrow="Health Library"
            title="Answers worth reading."
            subtitle="Plain-language health information, written and reviewed by our doctors."
            className="mb-0"
          />
          <Link to={ROUTES.healthLibrary} className="link-arrow flex-shrink-0">
            All articles <ArrowRight size={16} />
          </Link>
        </div>

        {/* Editorial staggered layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured — large */}
          {featured && (
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to={ROUTES.healthArticle(featured.slug)} className="group block card overflow-hidden h-full">
                {/* Image placeholder */}
                <div
                  className="w-full h-52 flex items-center justify-center"
                  style={{ background: 'var(--bone)' }}
                >
                  <div className="text-6xl opacity-30" aria-hidden="true">❤</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="default" size="sm">{featured.category}</Badge>
                    {featured.isReviewed && (
                      <span className="text-xs font-medium text-verdigris">✓ Doctor reviewed</span>
                    )}
                    <span className="ml-auto flex items-center gap-1 text-xs text-ink-soft">
                      <Clock size={12} /> {featured.readTime} min
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink group-hover:text-verdigris transition-colors mb-2 leading-tight">
                    {featured.title}
                  </h3>
                  <p className="text-ink-soft">{featured.excerpt}</p>
                  {featured.reviewer && (
                    <p className="text-xs text-ink-soft mt-3">
                      Reviewed by <span className="font-medium text-ink">{featured.reviewer}</span>
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side articles */}
          <div className="lg:col-span-2 space-y-4">
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link to={ROUTES.healthArticle(article.slug)} className="group block card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" size="sm">{article.category}</Badge>
                    <span className="ml-auto flex items-center gap-1 text-xs text-ink-soft">
                      <Clock size={11} /> {article.readTime} min
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-ink group-hover:text-verdigris transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-ink-soft mt-1 line-clamp-2">{article.excerpt}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

