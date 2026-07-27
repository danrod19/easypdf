import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Seo } from '../components/Seo';
import {
  formatBlogDate,
  getBlogPostsSorted,
} from '../data/blogPosts';
import { getSeoForPath } from '../data/seo';

export default function BlogPage() {
  const seo = getSeoForPath('/blog');
  const posts = getBlogPostsSorted();

  return (
    <>
      <Seo title={seo.title} description={seo.description} path={seo.path} />

      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
            <BookOpen className="h-4 w-4" aria-hidden />
            Blog Easy PDF Local
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Privacidade, PDF e produtividade
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Artigos práticos sobre processamento local, segurança de documentos e
            boas práticas — sem enrolação e com foco no que importa: seus arquivos
            na sua máquina.
          </p>
        </header>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="card group transition hover:border-brand-200 hover:shadow-md dark:hover:border-brand-900">
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
                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                  <Link to={`/blog/${post.slug}`} className="focus-visible:outline-none">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  Ler artigo
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            </li>
          ))}
        </ul>

        {posts.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            Em breve publicaremos os primeiros artigos.
          </p>
        )}
      </div>
    </>
  );
}
