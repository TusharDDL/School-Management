'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import academicService from '@/services/academic'

interface MarkAttendanceDialogProps {
  sectionId: number
  date: Date
}

interface AttendanceRecord {
  student_id: number
  section_id: number
  date: string
  is_present: boolean
  remarks?: string
}

export function MarkAttendanceDialog({
  sectionId,
  date,
}: MarkAttendanceDialogProps) {
  const [open, setOpen] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<number, AttendanceRecord>
  >({})
  const queryClient = useQueryClient()

  // Get section details to get the list of students
  const { data: section } = useQuery({
    queryKey: ['sections', sectionId],
    queryFn: () => academicService.getSections(),
    select: (data) => data.find((s) => s.id === sectionId),
  })

  // Get existing attendance records for the date
  const { data: existingAttendance } = useQuery({
    queryKey: ['attendance', sectionId, date],
    queryFn: () =>
      academicService.getAttendance({
        section: sectionId,
        date: format(date, 'yyyy-MM-dd'),
      }),
  })

  // Initialize attendance records when dialog opens
  const initializeAttendance = () => {
    const records: Record<number, AttendanceRecord> = {}
    section?.students?.forEach((student) => {
      const existing = existingAttendance?.find(
        (a) => a.student.id === student.id
      )
      records[student.id] = {
        student_id: student.id,
        section_id: sectionId,
        date: format(date, 'yyyy-MM-dd'),
        is_present: existing?.is_present ?? true,
        remarks: existing?.remarks ?? '',
      }
    })
    setAttendanceRecords(records)
  }

  const { mutate: markAttendance, isLoading } = useMutation({
    mutationFn: academicService.markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', sectionId, date],
      })
      setOpen(false)
    },
  })

  const handleSubmit = () => {
    markAttendance(Object.values(attendanceRecords))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) {
          initializeAttendance()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Mark Attendance</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Mark Attendance for {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section?.students?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendanceRecords[student.id]?.is_present}
                      onCheckedChange={(checked) => {
                        setAttendanceRecords((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            is_present: checked as boolean,
                          },
                        }))
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={attendanceRecords[student.id]?.remarks || ''}
                      onChange={(e) => {
                        setAttendanceRecords((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            remarks: e.target.value,
                          },
                        }))
                      }}
                      placeholder="Optional remarks"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
