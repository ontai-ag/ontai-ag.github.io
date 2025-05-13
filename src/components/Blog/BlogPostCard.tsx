import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/data/blogData'; // Предполагаемый путь
import { formatDate } from '@/lib/utils'; // Предположим, что есть такая утилита

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
      )}
      <CardHeader>
        <Link to={`/blog/${post.slug}`} className="hover:underline">
          <CardTitle className="text-xl font-semibold mb-2 leading-tight">
            {post.title}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground">
          {formatDate(post.date)} {post.author && `by ${post.author}`}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
        {post.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        <Link to={`/blog/${post.slug}`} className="text-sm text-primary hover:underline ml-auto self-end">
          Читать далее →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;