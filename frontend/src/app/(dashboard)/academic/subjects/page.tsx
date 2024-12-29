'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import academicService from '@/services/academic'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'

export default function SubjectsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: academicService.getSubjects,
  })

  const filteredSubjects = subjects?.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects</h1>
        {user?.role === 'school_admin' && (
          <Button>Add Subject</Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects?.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.code}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.class_name.name}</TableCell>
                <TableCell>
                  {subject.teacher.first_name} {subject.teacher.last_name}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
