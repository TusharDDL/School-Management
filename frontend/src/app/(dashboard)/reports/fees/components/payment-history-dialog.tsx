'use client'

import { format } from 'date-fns'
import { FeeReport } from '@/services/reports'
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
import { Badge } from '@/components/ui/badge'
import { IndianRupee } from 'lucide-react'
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

interface PaymentHistoryDialogProps {
  student: FeeReport
  onClose: () => void
}

export function PaymentHistoryDialog({
  student,
  onClose,
}: PaymentHistoryDialogProps) {
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-500">
            Paid
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-500">
            Pending
          </Badge>
        )
      case 'overdue':
        return (
          <Badge variant="destructive">
            Overdue
          </Badge>
        )
      default:
        return null
    }
  }

  // Prepare data for payment mode chart
  const paymentModeData = student.payment_history.reduce((acc: any[], payment) => {
    const existingMode = acc.find((item) => item.mode === payment.payment_mode)
    if (existingMode) {
      existingMode.amount += payment.amount
    } else {
      acc.push({
        mode: payment.payment_mode,
        amount: payment.amount,
      })
    }
    return acc
  }, [])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Payment History - {student.student_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Fees
              </h3>
              <div className="mt-1 flex items-baseline">
                <IndianRupee className="h-4 w-4" />
                <p className="text-2xl font-bold">
                  {student.total_fees.toLocaleString('en-IN')}
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Paid Amount
              </h3>
              <div className="mt-1 flex items-baseline">
                <IndianRupee className="h-4 w-4 text-green-600" />
                <p className="text-2xl font-bold text-green-600">
                  {student.paid_amount.toLocaleString('en-IN')}
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
                  {student.pending_amount.toLocaleString('en-IN')}
                </p>
              </div>
            </Card>
          </div>

          {/* Payment Mode Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment Mode Distribution
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentModeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    fill="#3b82f6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Payment History Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment History
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.payment_history.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(
                          new Date(payment.date),
                          'MMM d, yyyy h:mm a'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-baseline">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {payment.amount.toLocaleString('en-IN')}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.payment_mode}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">
                          {payment.transaction_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(payment.status)}
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
