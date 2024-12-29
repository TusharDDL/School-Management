'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Attendance } from '@/services/academic'

interface AttendanceTableProps {
  attendance: Attendance[]
  date: Date
  sectionId: number
}

export function AttendanceTable({
  attendance,
  date,
  sectionId,
}: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          Attendance for {format(date, 'MMMM d, yyyy')}
        </h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {record.student.first_name} {record.student.last_name}
              </TableCell>
              <TableCell>
                <Badge
                  variant={record.is_present ? 'default' : 'destructive'}
                >
                  {record.is_present ? 'Present' : 'Absent'}
                </Badge>
              </TableCell>
              <TableCell>{record.remarks}</TableCell>
            </TableRow>
          ))}
          {attendance.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No attendance records found for this date
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
