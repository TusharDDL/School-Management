'use client';

import { useState } from 'react';
import { useBooks } from '@/lib/hooks';
import { Book } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BookCatalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data: books, isLoading } = useBooks({ search, category });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            {/* Add more categories */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books?.map((book: Book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <p><strong>Available Copies:</strong> {book.available_copies}</p>
                <p><strong>Location:</strong> {book.location}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                disabled={book.available_copies === 0}
              >
                {book.available_copies > 0 ? 'Issue Book' : 'Not Available'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
