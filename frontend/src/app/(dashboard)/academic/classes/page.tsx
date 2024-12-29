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
import { AddClassDialog } from './components/add-class-dialog'
import { AddSectionDialog } from './components/add-section-dialog'

export default function ClassesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: academicService.getClasses,
  })

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const filteredClasses = classes?.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes & Sections</h1>
        {user?.role === 'school_admin' && (
          <div className="space-x-2">
            <AddClassDialog />
            <AddSectionDialog />
          </div>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses?.map((cls) => {
              const classSections = sections?.filter(
                (section) => section.class_name.id === cls.id
              )
              const totalStudents = classSections?.reduce(
                (sum, section) => sum + section.student_count,
                0
              )

              return (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.description}</TableCell>
                  <TableCell>
                    {classSections?.map((section) => section.name).join(', ')}
                  </TableCell>
                  <TableCell>{totalStudents}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
