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
  Mail,
  MessageSquare,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StudentAttendancePage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  // Get attendance data
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate, selectedClass, selectedSection, selectedSubject],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          student_id: 1,
          first_name: 'John',
          last_name: 'Smith',
          class: 'Class 10',
          section: 'A',
          roll_number: '101',
          avatar: null,
          attendance: {
            status: 'present',
            check_in: '08:30',
            check_out: '14:30',
            subjects: {
              Mathematics: true,
              Science: true,
              English: false,
              History: true,
            },
          },
          parent_phone: '+1234567890',
          parent_email: 'parent@example.com',
          attendance_percentage: 95,
        },
        {
          id: 2,
          student_id: 2,
          first_name: 'Sarah',
          last_name: 'Johnson',
          class: 'Class 10',
          section: 'A',
          roll_number: '102',
          avatar: null,
          attendance: {
            status: 'absent',
            check_in: null,
            check_out: null,
            subjects: {
              Mathematics: false,
              Science: false,
              English: false,
              History: false,
            },
          },
          parent_phone: '+1234567891',
          parent_email: 'parent2@example.com',
          attendance_percentage: 92,
        },
      ])
    },
  })

  // Get class schedule
  const { data: scheduleData } = useQuery({
    queryKey: ['schedule', selectedClass, selectedSection],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          subject: 'Mathematics',
          time: '08:30 - 09:30',
          teacher: 'Mr. Anderson',
        },
        {
          subject: 'Science',
          time: '09:30 - 10:30',
          teacher: 'Mrs. Smith',
        },
        {
          subject: 'English',
          time: '11:00 - 12:00',
          teacher: 'Ms. Johnson',
        },
        {
          subject: 'History',
          time: '12:00 - 13:00',
          teacher: 'Mr. Wilson',
        },
      ])
    },
  })

  const { mutate: markAttendance, isLoading: isMarking } = useMutation({
    mutationFn: ({
      studentId,
      status,
      subject,
    }: {
      studentId: number
      status: boolean
      subject?: string
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

  const { mutate: notifyParents, isLoading: isNotifying } = useMutation({
    mutationFn: (absentStudents: any[]) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Parents notified successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to notify parents.',
        variant: 'destructive',
      })
    },
  })

  // Calculate statistics
  const stats = attendanceData?.reduce(
    (acc, student) => {
      if (student.attendance.status === 'present') acc.present += 1
      else if (student.attendance.status === 'absent') acc.absent += 1
      else if (student.attendance.status === 'late') acc.late += 1

      acc.total += 1
      acc.attendance_percentage =
        (acc.present / acc.total) * 100

      return acc
    },
    {
      present: 0,
      absent: 0,
      late: 0,
      total: 0,
      attendance_percentage: 0,
    }
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Attendance</h1>
          <p className="text-gray-500">
            Manage and track student attendance
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h4 className="text-2xl font-bold">{stats?.total}</h4>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <h4 className="text-2xl font-bold">{stats?.present}</h4>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <h4 className="text-2xl font-bold">{stats?.absent}</h4>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <h4 className="text-2xl font-bold">{stats?.late}</h4>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <h4 className="text-2xl font-bold">
                {stats?.attendance_percentage.toFixed(1)}%
              </h4>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Class
              </label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={`Class ${i + 1}`}>
                      Class {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Section
              </label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Subject
              </label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {scheduleData?.map((schedule) => (
                    <SelectItem
                      key={schedule.subject}
                      value={schedule.subject}
                    >
                      {schedule.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="subject">Subject-wise</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Daily Attendance Table */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Daily Attendance</h3>
                <Button
                  variant="outline"
                  onClick={() =>
                    notifyParents(
                      attendanceData?.filter(
                        (s) => s.attendance.status === 'absent'
                      )
                    )
                  }
                  disabled={isNotifying}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Notify Parents
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={student.avatar || ''} />
                            <AvatarFallback>
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.first_name} {student.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.class} - {student.section}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>
                        {student.attendance.check_in || '-'}
                      </TableCell>
                      <TableCell>
                        {student.attendance.check_out || '-'}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={student.attendance.status === 'present'}
                          onCheckedChange={(checked) =>
                            markAttendance({
                              studentId: student.student_id,
                              status: checked,
                            })
                          }
                          disabled={isMarking}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Send notification
                              notifyParents([student])
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subject" className="space-y-4">
          {/* Subject-wise Attendance Table */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Subject-wise Attendance
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Today's Schedule:</p>
                  {scheduleData?.map((schedule) => (
                    <Badge
                      key={schedule.subject}
                      variant="secondary"
                      className="text-xs"
                    >
                      {schedule.subject} ({schedule.time})
                    </Badge>
                  ))}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    {scheduleData?.map((schedule) => (
                      <TableHead key={schedule.subject}>
                        {schedule.subject}
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={student.avatar || ''} />
                            <AvatarFallback>
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.first_name} {student.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.class} - {student.section}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      {scheduleData?.map((schedule) => (
                        <TableCell key={schedule.subject}>
                          <Switch
                            checked={
                              student.attendance.subjects[
                                schedule.subject
                              ]
                            }
                            onCheckedChange={(checked) =>
                              markAttendance({
                                studentId: student.student_id,
                                status: checked,
                                subject: schedule.subject,
                              })
                            }
                            disabled={isMarking}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Send notification
                              notifyParents([student])
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
