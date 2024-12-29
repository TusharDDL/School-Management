'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { BookCirculation as IBookCirculation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BookCirculation() {
  const [filter, setFilter] = useState('all'); // all, overdue, returned

  const { data: circulations, isLoading } = useQuery({
    queryKey: ['circulations', filter],
    queryFn: async () => {
      if (filter === 'overdue') {
        const response = await apiClient.getOverdueBooks();
        return response.data;
      }
      // Add more filter options
      return [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter records" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="overdue">Overdue Books</SelectItem>
            <SelectItem value="returned">Returned Books</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {circulations?.map((circulation: IBookCirculation) => (
            <TableRow key={circulation.id}>
              <TableCell>{circulation.book.title}</TableCell>
              <TableCell>
                {`${circulation.member.user.first_name} ${circulation.member.user.last_name}`}
              </TableCell>
              <TableCell>{circulation.issue_date}</TableCell>
              <TableCell>{circulation.due_date}</TableCell>
              <TableCell>{circulation.return_date || '-'}</TableCell>
              <TableCell>{circulation.status}</TableCell>
              <TableCell>${circulation.fine_amount}</TableCell>
              <TableCell>
                {circulation.status === 'issued' && (
                  <Button variant="outline" size="sm">
                    Return Book
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
