import React from 'react';
import BlogLayout from '@/layouts/BlogLayout';
import BlogPostCard from '@/components/Blog/BlogPostCard';
import { mockPosts } from '@/data/blogData';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'; // Для пагинации (заглушка)

const BlogIndexPage: React.FC = () => {
  // TODO: Реализовать логику пагинации
  const currentPage = 1;
  const postsPerPage = 6;
  const paginatedPosts = mockPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <BlogLayout>
      <div className="space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
            Блог Ontai
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Статьи, инсайты и новости из мира искусственного интеллекта от команды Ontai.
          </p>
        </header>

        <Separator />

        {paginatedPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Пока нет ни одного поста. Следите за обновлениями!
          </p>
        )}

        {/* Заглушка для пагинации */} 
        {mockPosts.length > postsPerPage && (
          <div className="flex justify-center items-center space-x-2 pt-8">
            <Button variant="outline" disabled={currentPage === 1}>
              Предыдущая
            </Button>
            <span className="text-sm text-muted-foreground">
              Страница {currentPage} из {Math.ceil(mockPosts.length / postsPerPage)}
            </span>
            <Button variant="outline" disabled={currentPage * postsPerPage >= mockPosts.length}>
              Следующая
            </Button>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogIndexPage;