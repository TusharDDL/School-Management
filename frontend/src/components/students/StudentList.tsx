'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudents } from '@/lib/hooks';
import { Student } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function StudentList() {
  const [filters, setFilters] = useState({
    class_name: '',
    section: '',
    search: '',
  });

  const { data: students, isLoading } = useStudents(filters);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleClassChange = (value: string) => {
    setFilters(prev => ({ ...prev, class_name: value }));
  };

  const handleSectionChange = (value: string) => {
    setFilters(prev => ({ ...prev, section: value }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search students..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filters.class_name} onValueChange={handleClassChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {/* Add class options */}
            <SelectItem value="Class 1">Class 1</SelectItem>
            <SelectItem value="Class 2">Class 2</SelectItem>
            {/* Add more classes */}
          </SelectContent>
        </Select>
        <Select value={filters.section} onValueChange={handleSectionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Section A</SelectItem>
            <SelectItem value="B">Section B</SelectItem>
            <SelectItem value="C">Section C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admission No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Roll No.</TableHead>
            <TableHead>Parent Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student: Student) => (
            <TableRow key={student.id}>
              <TableCell>{student.admission_number}</TableCell>
              <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
              <TableCell>{student.class_name}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.roll_number}</TableCell>
              <TableCell>{student.parent_name}</TableCell>
              <TableCell>{student.parent_phone}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
