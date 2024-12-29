'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useAuth } from '@/lib/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Download } from 'lucide-react'
import academicService from '@/services/academic'
import reportsService from '@/services/reports'

export default function PerformanceReportsPage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Get filter options
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: academicService.getClasses,
  })

  const { data: sections } = useQuery({
    queryKey: ['sections', selectedClass],
    queryFn: academicService.getSections,
    enabled: !!selectedClass,
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects', selectedClass],
    queryFn: academicService.getSubjects,
    enabled: !!selectedClass,
  })

  // Get performance data
  const { data: performanceData } = useQuery({
    queryKey: [
      'student-performance',
      selectedClass,
      selectedSection,
      selectedSubject,
      dateRange,
    ],
    queryFn: () =>
      reportsService.getStudentPerformance({
        class_id: selectedClass ? parseInt(selectedClass) : undefined,
        section_id: selectedSection ? parseInt(selectedSection) : undefined,
        subject_id: selectedSubject ? parseInt(selectedSubject) : undefined,
        from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
    enabled: !!user,
  })

  const handleExport = async (format: 'pdf' | 'excel') => {
    const blob = await reportsService.exportStudentPerformance({
      class_id: selectedClass ? parseInt(selectedClass) : undefined,
      section_id: selectedSection ? parseInt(selectedSection) : undefined,
      subject_id: selectedSubject ? parseInt(selectedSubject) : undefined,
      from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      format,
    })

    const filename = `performance-report-${format === 'pdf' ? 'pdf' : 'xlsx'}`
    reportsService.downloadFile(blob, filename)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Performance Reports</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
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
                {classes?.map((cls) => (
                  <SelectItem
                    key={cls.id}
                    value={cls.id.toString()}
                  >
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Section
            </label>
            <Select
              value={selectedSection}
              onValueChange={setSelectedSection}
              disabled={!selectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections?.map((section) => (
                  <SelectItem
                    key={section.id}
                    value={section.id.toString()}
                  >
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Subject
            </label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.id.toString()}
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Date Range
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dateRange.from && 'text-muted-foreground'
                  }`}
                >
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) =>
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Subject-wise Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData?.subjects || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="average_percentage"
                  name="Average Score"
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Assessment Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData?.subjects
                  .flatMap((subject) =>
                    subject.assessments.map((assessment) => ({
                      name: assessment.name,
                      percentage: assessment.percentage,
                      subject: subject.subject_name,
                    }))
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.name).getTime() - new Date(b.name).getTime()
                  )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Score %"
                  stroke="#3b82f6"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Performance Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Student</th>
                {performanceData?.subjects.map((subject) => (
                  <th
                    key={subject.subject_name}
                    className="text-left py-3 px-4"
                  >
                    {subject.subject_name}
                  </th>
                ))}
                <th className="text-left py-3 px-4">Overall</th>
              </tr>
            </thead>
            <tbody>
              {performanceData?.map((student) => (
                <tr key={student.student_id} className="border-b">
                  <td className="py-3 px-4">
                    {student.student_name}
                  </td>
                  {student.subjects.map((subject) => (
                    <td
                      key={subject.subject_name}
                      className="py-3 px-4"
                    >
                      {subject.average_percentage.toFixed(1)}%
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    {student.overall_average.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
