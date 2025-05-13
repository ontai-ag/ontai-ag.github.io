import React from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogLayout from '@/layouts/BlogLayout';
import { mockPosts, Post } from '@/data/blogData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils'; // Предположим, что есть такая утилита

// Простой компонент для рендеринга Markdown-подобного контента как HTML
// В реальном приложении здесь бы использовался Markdown-парсер (например, react-markdown)
const PostContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Заменяем основные Markdown-подобные элементы на HTML-теги
  // Это очень упрощенная реализация для демонстрации
  const htmlContent = content
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-5 mb-2">$1</h3>')
    .replace(/^\*\* (.*$)/gim, '<p class="mt-2 mb-2 text-lg"><strong>$1</strong></p>') // Полужирный как отдельный параграф
    .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc">$1</li>') // Элементы списка
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">$1</blockquote>')
    .replace(/\`\`\`(\w*)\n([\s\S]*?)\n\`\`\`/gm, (_match, lang, code) => {
      return `<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto text-sm"><code class="language-${lang || ''}">${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    })
    .replace(/\n/g, '<br />'); // Заменяем переносы строк на <br />, кроме тех, что уже обработаны

  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = mockPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <BlogLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold">Пост не найден</h1>
          <p className="text-muted-foreground mt-2">Запрашиваемый пост не существует или был перемещен.</p>
          <Button asChild variant="link" className="mt-6">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к списку постов
            </Link>
          </Button>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <article className="max-w-3xl mx-auto py-8">
        <header className="mb-8">
          <Link to="/blog" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку постов
          </Link>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary mb-3">
            {post.title}
          </h1>
          <div className="text-sm text-muted-foreground space-x-2">
            <span>{formatDate(post.date)}</span>
            {post.author && <span>by {post.author}</span>}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </header>
        
        <Separator className="my-8" />

        <PostContentRenderer content={post.content} />

        <Separator className="my-12" />

        <footer className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Заглушки для кнопок "Поделиться" */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Поделиться в X</Button>
            <Button variant="outline" size="sm">Поделиться в Facebook</Button>
          </div>
          <Link to="/blog" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к списку постов
          </Link>
        </footer>
      </article>
    </BlogLayout>
  );
};

export default BlogPostPage;