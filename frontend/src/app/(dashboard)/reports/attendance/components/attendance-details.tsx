'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { AttendanceReport } from '@/services/reports'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'
import { MonthlyBreakdownDialog } from './monthly-breakdown-dialog'

interface AttendanceDetailsProps {
  data: AttendanceReport[]
}

export function AttendanceDetails({ data }: AttendanceDetailsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<AttendanceReport | null>(
    null
  )

  const filteredData = data.filter((student) =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) {
      return (
        <Badge variant="default" className="bg-green-500">
          Excellent
        </Badge>
      )
    } else if (percentage >= 75) {
      return (
        <Badge variant="default" className="bg-blue-500">
          Good
        </Badge>
      )
    } else if (percentage >= 60) {
      return (
        <Badge variant="default" className="bg-yellow-500">
          Average
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          Poor
        </Badge>
      )
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Attendance Details</h2>
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">
                    {student.student_name}
                  </TableCell>
                  <TableCell>{student.class_name}</TableCell>
                  <TableCell>{student.section_name}</TableCell>
                  <TableCell>{student.total_days}</TableCell>
                  <TableCell className="text-green-600">
                    {student.present_days}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {student.absent_days}
                  </TableCell>
                  <TableCell>
                    {student.attendance_percentage.toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    {getAttendanceStatus(student.attendance_percentage)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Monthly Breakdown
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedStudent && (
        <MonthlyBreakdownDialog
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  )
}
