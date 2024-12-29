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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Download } from 'lucide-react'
import academicService from '@/services/academic'
import reportsService from '@/services/reports'
import { AttendanceDetails } from './components/attendance-details'

const COLORS = ['#22c55e', '#ef4444']

export default function AttendanceReportsPage() {
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

  // Get attendance data
  const { data: attendanceData } = useQuery({
    queryKey: [
      'attendance-report',
      selectedClass,
      selectedSection,
      dateRange,
    ],
    queryFn: () =>
      reportsService.getAttendanceReport({
        class_id: selectedClass ? parseInt(selectedClass) : undefined,
        section_id: selectedSection ? parseInt(selectedSection) : undefined,
        from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
    enabled: !!user,
  })

  const handleExport = async (format: 'pdf' | 'excel') => {
    const blob = await reportsService.exportAttendanceReport({
      class_id: selectedClass ? parseInt(selectedClass) : undefined,
      section_id: selectedSection ? parseInt(selectedSection) : undefined,
      from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      format,
    })

    const filename = `attendance-report-${format === 'pdf' ? 'pdf' : 'xlsx'}`
    reportsService.downloadFile(blob, filename)
  }

  // Calculate overall statistics
  const overallStats = attendanceData?.reduce(
    (acc, student) => {
      acc.totalDays += student.total_days
      acc.presentDays += student.present_days
      acc.absentDays += student.absent_days
      return acc
    },
    { totalDays: 0, presentDays: 0, absentDays: 0 }
  )

  const attendancePercentage = overallStats
    ? Math.round((overallStats.presentDays / overallStats.totalDays) * 100)
    : 0

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Reports</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Total Working Days
          </h3>
          <p className="text-2xl font-bold mt-1">
            {overallStats?.totalDays || 0}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Present Days
          </h3>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {overallStats?.presentDays || 0}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Absent Days
          </h3>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {overallStats?.absentDays || 0}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Attendance Rate
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {attendancePercentage}%
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Attendance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceData?.[0]?.monthly_breakdown || []}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Attendance %"
                  stroke="#3b82f6"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Present vs Absent Days
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Present',
                      value: overallStats?.presentDays || 0,
                    },
                    {
                      name: 'Absent',
                      value: overallStats?.absentDays || 0,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    name,
                  }) => {
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5
                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    )
                  }}
                  outerRadius={100}
                  dataKey="value"
                >
                  {[0, 1].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      {attendanceData && (
        <AttendanceDetails data={attendanceData} />
      )}
    </div>
  )
}
