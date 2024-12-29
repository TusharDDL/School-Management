'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  BarChart2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function StaffAttendancePage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')

  // Get attendance data
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['staff-attendance', selectedDate, selectedDepartment],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          staff_id: 1,
          first_name: 'John',
          last_name: 'Smith',
          department: 'Mathematics',
          designation: 'Senior Teacher',
          avatar: null,
          date: format(selectedDate, 'yyyy-MM-dd'),
          check_in: '08:30',
          check_out: '16:30',
          status: 'present',
          late_minutes: 0,
          overtime_minutes: 30,
        },
        {
          id: 2,
          staff_id: 2,
          first_name: 'Sarah',
          last_name: 'Johnson',
          department: 'Science',
          designation: 'Lab Coordinator',
          avatar: null,
          date: format(selectedDate, 'yyyy-MM-dd'),
          check_in: '09:15',
          check_out: '16:00',
          status: 'late',
          late_minutes: 15,
          overtime_minutes: 0,
        },
        {
          id: 3,
          staff_id: 3,
          first_name: 'Mike',
          last_name: 'Wilson',
          department: 'English',
          designation: 'Teacher',
          avatar: null,
          date: format(selectedDate, 'yyyy-MM-dd'),
          check_in: null,
          check_out: null,
          status: 'absent',
          late_minutes: 0,
          overtime_minutes: 0,
        },
      ])
    },
  })

  const { mutate: markAttendance, isLoading: isMarking } = useMutation({
    mutationFn: ({
      staffId,
      status,
      checkIn,
      checkOut,
    }: {
      staffId: number
      status: string
      checkIn?: string
      checkOut?: string
    }) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Attendance marked successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to mark attendance.',
        variant: 'destructive',
      })
    },
  })

  // Calculate statistics
  const stats = attendanceData?.reduce(
    (acc, record) => {
      if (record.status === 'present') acc.present += 1
      else if (record.status === 'absent') acc.absent += 1
      else if (record.status === 'late') acc.late += 1

      if (record.late_minutes > 0) acc.totalLateMinutes += record.late_minutes
      if (record.overtime_minutes > 0)
        acc.totalOvertimeMinutes += record.overtime_minutes

      return acc
    },
    {
      present: 0,
      absent: 0,
      late: 0,
      totalLateMinutes: 0,
      totalOvertimeMinutes: 0,
    }
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Present
          </span>
        )
      case 'late':
        return (
          <span className="flex items-center text-yellow-600">
            <Clock className="h-4 w-4 mr-1" />
            Late
          </span>
        )
      case 'absent':
        return (
          <span className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            Absent
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Attendance</h1>
          <p className="text-gray-500">
            Track and manage staff attendance
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <BarChart2 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {format(selectedDate, 'PPP')}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Department
              </label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {[
                    'Mathematics',
                    'Science',
                    'English',
                    'History',
                    'Geography',
                    'Administration',
                  ].map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Total Staff
          </h3>
          <p className="text-2xl font-bold mt-1">
            {(stats?.present || 0) +
              (stats?.absent || 0) +
              (stats?.late || 0)}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Present</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats?.present || 0}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Late</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {stats?.late || 0}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Absent</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {stats?.absent || 0}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Attendance Rate
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {Math.round(
              ((stats?.present || 0) /
                ((stats?.present || 0) +
                  (stats?.absent || 0) +
                  (stats?.late || 0))) *
                100
            )}
            %
          </p>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Late</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={record.avatar || ''} />
                        <AvatarFallback>
                          {record.first_name[0]}
                          {record.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {record.first_name} {record.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.designation}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>
                    {record.check_in || '-'}
                  </TableCell>
                  <TableCell>
                    {record.check_out || '-'}
                  </TableCell>
                  <TableCell>
                    {record.late_minutes > 0
                      ? `${record.late_minutes} mins`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {record.overtime_minutes > 0
                      ? `${record.overtime_minutes} mins`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          markAttendance({
                            staffId: record.staff_id,
                            status: 'present',
                            checkIn: '09:00',
                          })
                        }
                        disabled={record.status === 'present'}
                      >
                        Mark Present
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
