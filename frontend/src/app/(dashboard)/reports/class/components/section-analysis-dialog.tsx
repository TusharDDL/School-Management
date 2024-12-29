'use client'

import { ClassReport } from '@/services/reports'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

interface SectionAnalysisDialogProps {
  section: ClassReport['sections'][0]
  onClose: () => void
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444']

export function SectionAnalysisDialog({
  section,
  onClose,
}: SectionAnalysisDialogProps) {
  // Prepare data for performance distribution chart
  const performanceDistribution = [
    {
      name: 'Above 90%',
      value: Math.round(Math.random() * 30),
    },
    {
      name: '60-90%',
      value: Math.round(Math.random() * 50),
    },
    {
      name: 'Below 60%',
      value: Math.round(Math.random() * 20),
    },
  ]

  // Prepare data for subject performance chart
  const subjectPerformance = [
    {
      subject: 'Mathematics',
      performance: Math.round(Math.random() * 100),
      attendance: Math.round(Math.random() * 100),
    },
    {
      subject: 'Science',
      performance: Math.round(Math.random() * 100),
      attendance: Math.round(Math.random() * 100),
    },
    {
      subject: 'English',
      performance: Math.round(Math.random() * 100),
      attendance: Math.round(Math.random() * 100),
    },
    {
      subject: 'History',
      performance: Math.round(Math.random() * 100),
      attendance: Math.round(Math.random() * 100),
    },
    {
      subject: 'Geography',
      performance: Math.round(Math.random() * 100),
      attendance: Math.round(Math.random() * 100),
    },
  ]

  // Prepare data for monthly trend chart
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
    performance: Math.round(Math.random() * 100),
    attendance: Math.round(Math.random() * 100),
  }))

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Section Analysis - {section.section_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Students
              </h3>
              <p className="text-2xl font-bold mt-1">
                {section.total_students}
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Average Attendance
              </h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {section.average_attendance}%
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Average Performance
              </h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {section.average_performance}%
              </p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Performance Distribution
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceDistribution}
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
                      {performanceDistribution.map((entry, index) => (
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

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Subject-wise Analysis
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="performance"
                      name="Performance %"
                      fill="#a855f7"
                    />
                    <Bar
                      dataKey="attendance"
                      name="Attendance %"
                      fill="#22c55e"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Trend
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    name="Performance %"
                    stroke="#a855f7"
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance %"
                    stroke="#22c55e"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Students */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Top Performing Students
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Assignments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        #{i + 1}
                      </TableCell>
                      <TableCell>
                        Student {i + 1}
                      </TableCell>
                      <TableCell>
                        {Math.round(95 - i * 2)}%
                      </TableCell>
                      <TableCell>
                        {Math.round(98 - i * 3)}%
                      </TableCell>
                      <TableCell>
                        {Math.round(100 - i * 4)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
