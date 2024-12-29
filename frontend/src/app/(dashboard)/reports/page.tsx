'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { FileText, Users, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import reportsService from '@/services/reports'

export default function ReportsPage() {
  const { user } = useAuth()

  // Get overview data based on user role
  const { data: performanceData } = useQuery({
    queryKey: ['student-performance'],
    queryFn: () => reportsService.getStudentPerformance(),
    enabled: !!user,
  })

  const { data: attendanceData } = useQuery({
    queryKey: ['attendance-report'],
    queryFn: () => reportsService.getAttendanceReport(),
    enabled: !!user,
  })

  const { data: feeData } = useQuery({
    queryKey: ['fee-report'],
    queryFn: () => reportsService.getFeeReport(),
    enabled: !!user,
  })

  const { data: classData } = useQuery({
    queryKey: ['class-report'],
    queryFn: () => reportsService.getClassReport(),
    enabled: !!user && ['super_admin', 'school_admin', 'teacher'].includes(user.role),
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/reports/performance">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Performance Reports</h3>
                <p className="text-sm text-gray-500">
                  View academic performance
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/reports/attendance">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Attendance Reports</h3>
                <p className="text-sm text-gray-500">
                  Track attendance records
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/reports/fees">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Fee Reports</h3>
                <p className="text-sm text-gray-500">
                  Monitor fee collections
                </p>
              </div>
            </div>
          </Card>
        </Link>

        {['super_admin', 'school_admin', 'teacher'].includes(user?.role || '') && (
          <Link href="/reports/class">
            <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Class Reports</h3>
                  <p className="text-sm text-gray-500">
                    Class-wise analytics
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
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
          <h2 className="text-lg font-semibold mb-4">Attendance Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData?.monthly_breakdown || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Attendance %"
                  stroke="#22c55e"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Fee Collection Overview */}
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Fee Collection Overview</h2>
          <Button variant="outline" asChild>
            <Link href="/reports/fees">View Details</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">
              Total Collected
            </h3>
            <p className="text-2xl font-bold text-green-700">
              ₹{feeData?.paid_amount || 0}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">
              Pending
            </h3>
            <p className="text-2xl font-bold text-yellow-700">
              ₹{feeData?.pending_amount || 0}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">
              Collection Rate
            </h3>
            <p className="text-2xl font-bold text-blue-700">
              {feeData
                ? Math.round(
                    (feeData.paid_amount /
                      (feeData.paid_amount + feeData.pending_amount)) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </Card>

      {/* Class Overview */}
      {['super_admin', 'school_admin', 'teacher'].includes(user?.role || '') && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Class Overview</h2>
            <Button variant="outline" asChild>
              <Link href="/reports/class">View Details</Link>
            </Button>
          </div>
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
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  )
}
