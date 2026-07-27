import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock } from 'lucide-react';
import { Seo } from '../components/Seo';
import {
  formatBlogDate,
  getBlogPostBySlug,
} from '../data/blogPosts';
import { SITE_NAME } from '../data/seo';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; markdown: string }
  | { status: 'error' };

/**
 * Carrega Markdown via import dinâmico Vite (?raw) e renderiza com react-markdown.
 */
export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const meta = getBlogPostBySlug(slug);
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug || !meta) {
        setState({ status: 'error' });
        return;
      }

      setState({ status: 'loading' });

      try {
        // Vite: import dinâmico de .md como string
        const mod = await import(`../data/posts/${slug}.md?raw`);
        const markdown = typeof mod === 'string' ? mod : (mod.default as string);
        if (!cancelled) {
          setState({ status: 'ready', markdown });
        }
      } catch (err) {
        console.error('[Blog] falha ao carregar post', slug, err);
        if (!cancelled) setState({ status: 'error' });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, meta]);

  if (!meta) {
    return (
      <>
        <Seo
          title={`Artigo não encontrado | ${SITE_NAME}`}
          description="O artigo solicitado não existe no blog do Easy PDF Local."
          path={`/blog/${slug}`}
        />
        <div className="card mx-auto max-w-lg text-center">
          <h1 className="text-xl font-semibold">Artigo não encontrado</h1>
          <p className="mt-2 text-sm text-slate-500">
            O endereço pode estar incorreto ou o post foi removido.
          </p>
          <Link to="/blog" className="btn-primary mt-6 inline-flex">
            Voltar ao blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${meta.title} | Blog ${SITE_NAME}`}
        description={meta.excerpt}
        path={`/blog/${meta.slug}`}
      />

      <article className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Todos os artigos
        </Link>

        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <time dateTime={meta.date}>{formatBlogDate(meta.date)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {meta.readTime} de leitura
            </span>
          </div>
          {/* h1 vem do Markdown; fallback acessível se o MD não tiver título */}
          <p className="sr-only">{meta.title}</p>
        </header>

        {state.status === 'loading' && (
          <div
            className="flex min-h-[30vh] flex-col items-center justify-center gap-3 py-12"
            role="status"
            aria-live="polite"
          >
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <p className="text-sm text-slate-500">Carregando artigo…</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="card text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Não foi possível carregar o conteúdo deste artigo.
            </p>
            <Link to="/blog" className="btn-secondary mt-4 inline-flex">
              Voltar ao blog
            </Link>
          </div>
        )}

        {state.status === 'ready' && (
          <div
            className="prose prose-slate prose-red max-w-none dark:prose-invert lg:prose-lg prose-headings:tracking-tight prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-brand-400"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {state.markdown}
            </ReactMarkdown>
          </div>
        )}

        <footer className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao blog
          </Link>
        </footer>
      </article>
    </>
  );
}
