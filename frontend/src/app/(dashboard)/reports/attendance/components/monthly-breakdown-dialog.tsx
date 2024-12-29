'use client'

import { AttendanceReport } from '@/services/reports'
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
} from 'recharts'

interface MonthlyBreakdownDialogProps {
  student: AttendanceReport
  onClose: () => void
}

export function MonthlyBreakdownDialog({
  student,
  onClose,
}: MonthlyBreakdownDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Monthly Attendance - {student.student_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Days
              </h3>
              <p className="text-2xl font-bold mt-1">
                {student.total_days}
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Present Days
              </h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {student.present_days}
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Absent Days
              </h3>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {student.absent_days}
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Attendance Rate
              </h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {student.attendance_percentage.toFixed(1)}%
              </p>
            </Card>
          </div>

          {/* Monthly Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Attendance Trend
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={student.monthly_breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="present_days"
                    name="Present Days"
                    fill="#22c55e"
                  />
                  <Bar
                    dataKey="absent_days"
                    name="Absent Days"
                    fill="#ef4444"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Details Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Breakdown
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Present Days</TableHead>
                    <TableHead>Absent Days</TableHead>
                    <TableHead>Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.monthly_breakdown.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">
                        {month.month}
                      </TableCell>
                      <TableCell>
                        {month.total_days}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {month.present_days}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {month.absent_days}
                      </TableCell>
                      <TableCell>
                        {month.percentage.toFixed(1)}%
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
