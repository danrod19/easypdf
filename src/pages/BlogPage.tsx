import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Seo } from '../components/Seo';
import {
  formatBlogDate,
  getFeaturedBlogPosts,
  getToolGuideBlogPosts,
  type BlogPostMeta,
} from '../data/blogPosts';
import { getSeoForPath } from '../data/seo';

function PostCard({
  post,
  compact = false,
}: {
  post: BlogPostMeta;
  compact?: boolean;
}) {
  return (
    <article
      className={
        compact
          ? 'rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-900'
          : 'card group transition hover:border-brand-200 hover:shadow-md dark:hover:border-brand-900'
      }
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {post.readTime} de leitura
        </span>
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2
        className={
          compact
            ? 'mt-2 text-base font-semibold tracking-tight text-slate-900 dark:text-white'
            : 'mt-3 text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300'
        }
      >
        <Link to={`/blog/${post.slug}`} className="focus-visible:outline-none">
          {post.title}
        </Link>
      </h2>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {post.excerpt}
        </p>
      )}
      <Link
        to={`/blog/${post.slug}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
      >
        {compact ? 'Abrir guia' : 'Ler artigo'}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </article>
  );
}

export default function BlogPage() {
  const seo = getSeoForPath('/blog');
  const featured = getFeaturedBlogPosts();
  const guides = getToolGuideBlogPosts();

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
            <BookOpen className="h-4 w-4" aria-hidden />
            Blog Easy PDF Local
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Privacidade, PDF e o que o navegador realmente faz
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Textos originais sobre processamento local, documentos e LGPD — com
            limites honestos. Abaixo, guias curtos que só apontam para cada
            ferramenta.
          </p>
        </header>

        <section aria-labelledby="blog-destaque">
          <h2
            id="blog-destaque"
            className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50"
          >
            Em destaque
          </h2>
          <ul className="space-y-4">
            {featured.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          {featured.length === 0 && (
            <p className="text-sm text-slate-500">Nenhum artigo em destaque.</p>
          )}
        </section>

        {guides.length > 0 && (
          <section aria-labelledby="blog-guias-curtos">
            <h2
              id="blog-guias-curtos"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              Guias curtos das ferramentas
            </h2>
            <p className="mt-1 mb-4 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Passo a passo resumido de cada tool — o conteúdo canônico está na
              própria página da ferramenta.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {guides.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} compact />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
