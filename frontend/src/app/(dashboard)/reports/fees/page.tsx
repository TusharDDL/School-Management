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
import { Download, IndianRupee } from 'lucide-react'
import academicService from '@/services/academic'
import reportsService from '@/services/reports'
import { FeeDetails } from './components/fee-details'

const COLORS = ['#22c55e', '#f59e0b', '#ef4444']

export default function FeeReportsPage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
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

  // Get fee data
  const { data: feeData } = useQuery({
    queryKey: [
      'fee-report',
      selectedClass,
      selectedSection,
      selectedStatus,
      dateRange,
    ],
    queryFn: () =>
      reportsService.getFeeReport({
        class_id: selectedClass ? parseInt(selectedClass) : undefined,
        section_id: selectedSection ? parseInt(selectedSection) : undefined,
        payment_status: selectedStatus !== 'all'
          ? (selectedStatus as 'paid' | 'pending' | 'overdue')
          : undefined,
        from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
    enabled: !!user,
  })

  const handleExport = async (format: 'pdf' | 'excel') => {
    const blob = await reportsService.exportFeeReport({
      class_id: selectedClass ? parseInt(selectedClass) : undefined,
      section_id: selectedSection ? parseInt(selectedSection) : undefined,
      payment_status: selectedStatus !== 'all'
        ? (selectedStatus as 'paid' | 'pending' | 'overdue')
        : undefined,
      from_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      to_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      format,
    })

    const filename = `fee-report-${format === 'pdf' ? 'pdf' : 'xlsx'}`
    reportsService.downloadFile(blob, filename)
  }

  // Calculate overall statistics
  const overallStats = feeData?.reduce(
    (acc, student) => {
      acc.totalFees += student.total_fees
      acc.paidAmount += student.paid_amount
      acc.pendingAmount += student.pending_amount
      return acc
    },
    { totalFees: 0, paidAmount: 0, pendingAmount: 0 }
  )

  const collectionRate = overallStats
    ? Math.round((overallStats.paidAmount / overallStats.totalFees) * 100)
    : 0

  // Prepare data for payment status chart
  const paymentStatusData = [
    {
      name: 'Paid',
      value: overallStats?.paidAmount || 0,
    },
    {
      name: 'Pending',
      value:
        (overallStats?.pendingAmount || 0) -
        (feeData?.reduce(
          (acc, student) =>
            acc +
            student.payment_history.reduce(
              (sum, payment) =>
                payment.status === 'overdue' ? sum + payment.amount : sum,
              0
            ),
          0
        ) || 0),
    },
    {
      name: 'Overdue',
      value:
        feeData?.reduce(
          (acc, student) =>
            acc +
            student.payment_history.reduce(
              (sum, payment) =>
                payment.status === 'overdue' ? sum + payment.amount : sum,
              0
            ),
          0
        ) || 0,
    },
  ]

  // Prepare data for payment trend chart
  const paymentTrendData = feeData?.reduce((acc: any[], student) => {
    student.payment_history.forEach((payment) => {
      const month = format(new Date(payment.date), 'MMM yyyy')
      const existingMonth = acc.find((item) => item.month === month)
      if (existingMonth) {
        existingMonth.amount += payment.amount
      } else {
        acc.push({ month, amount: payment.amount })
      }
    })
    return acc.sort(
      (a, b) =>
        new Date(a.month).getTime() - new Date(b.month).getTime()
    )
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fee Reports</h1>
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
              Payment Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
            Total Fees
          </h3>
          <div className="mt-1 flex items-baseline">
            <IndianRupee className="h-4 w-4" />
            <p className="text-2xl font-bold">
              {overallStats?.totalFees.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Collected Amount
          </h3>
          <div className="mt-1 flex items-baseline">
            <IndianRupee className="h-4 w-4 text-green-600" />
            <p className="text-2xl font-bold text-green-600">
              {overallStats?.paidAmount.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Pending Amount
          </h3>
          <div className="mt-1 flex items-baseline">
            <IndianRupee className="h-4 w-4 text-red-600" />
            <p className="text-2xl font-bold text-red-600">
              {overallStats?.pendingAmount.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Collection Rate
          </h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {collectionRate}%
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Payment Status Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
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
                  {paymentStatusData.map((entry, index) => (
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
            Payment Collection Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Collection Amount"
                  stroke="#3b82f6"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      {feeData && (
        <FeeDetails data={feeData} />
      )}
    </div>
  )
}
