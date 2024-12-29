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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { Download, Users, GraduationCap, Clock } from 'lucide-react'
import academicService from '@/services/academic'
import reportsService from '@/services/reports'
import { SectionDetails } from './components/section-details'

export default function ClassReportsPage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
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

  // Get class report data
  const { data: classData } = useQuery({
    queryKey: [
      'class-report',
      selectedClass,
      selectedSection,
      dateRange,
    ],
    queryFn: () =>
      reportsService.getClassReport({
        class_id: selectedClass ? parseInt(selectedClass) : undefined,
        section_id: selectedSection ? parseInt(selectedSection) : undefined,
        from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
    enabled: !!user,
  })

  const handleExport = async (format: 'pdf' | 'excel') => {
    const blob = await reportsService.exportClassReport({
      class_id: selectedClass ? parseInt(selectedClass) : undefined,
      section_id: selectedSection ? parseInt(selectedSection) : undefined,
      from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      format,
    })

    const filename = `class-report-${format === 'pdf' ? 'pdf' : 'xlsx'}`
    reportsService.downloadFile(blob, filename)
  }

  // Calculate overall statistics
  const overallStats = classData?.sections.reduce(
    (acc, section) => {
      acc.totalStudents += section.total_students
      acc.averageAttendance += section.average_attendance * section.total_students
      acc.averagePerformance += section.average_performance * section.total_students
      return acc
    },
    { totalStudents: 0, averageAttendance: 0, averagePerformance: 0 }
  )

  if (overallStats) {
    overallStats.averageAttendance = Math.round(
      overallStats.averageAttendance / overallStats.totalStudents
    )
    overallStats.averagePerformance = Math.round(
      overallStats.averagePerformance / overallStats.totalStudents
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Reports</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="">All Sections</SelectItem>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Students
              </h3>
              <p className="text-2xl font-bold mt-1">
                {overallStats?.totalStudents || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Average Attendance
              </h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {overallStats?.averageAttendance || 0}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Average Performance
              </h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {overallStats?.averagePerformance || 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Section-wise Performance
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData?.sections || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="average_attendance"
                  name="Attendance %"
                  fill="#22c55e"
                />
                <Bar
                  dataKey="average_performance"
                  name="Performance %"
                  fill="#a855f7"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Overall Analysis
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={[
                  {
                    subject: 'Attendance',
                    value: overallStats?.averageAttendance || 0,
                  },
                  {
                    subject: 'Performance',
                    value: overallStats?.averagePerformance || 0,
                  },
                  {
                    subject: 'Assignment Completion',
                    value: Math.round(Math.random() * 100),
                  },
                  {
                    subject: 'Class Participation',
                    value: Math.round(Math.random() * 100),
                  },
                  {
                    subject: 'Discipline',
                    value: Math.round(Math.random() * 100),
                  },
                ]}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Class Analysis"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Section Details */}
      {classData && (
        <SectionDetails data={classData.sections} />
      )}
    </div>
  )
}
