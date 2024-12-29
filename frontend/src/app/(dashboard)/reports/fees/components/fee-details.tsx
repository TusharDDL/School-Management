'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { FeeReport } from '@/services/reports'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, IndianRupee } from 'lucide-react'
import { PaymentHistoryDialog } from './payment-history-dialog'

interface FeeDetailsProps {
  data: FeeReport[]
}

export function FeeDetails({ data }: FeeDetailsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<FeeReport | null>(
    null
  )

  const filteredData = data.filter((student) =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPaymentStatus = (
    totalFees: number,
    paidAmount: number,
    pendingAmount: number
  ) => {
    if (pendingAmount === 0) {
      return (
        <Badge variant="default" className="bg-green-500">
          Paid
        </Badge>
      )
    } else if (
      pendingAmount > 0 &&
      paidAmount > 0
    ) {
      return (
        <Badge variant="default" className="bg-yellow-500">
          Partial
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          Pending
        </Badge>
      )
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Fee Details</h2>
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Total Fees</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Pending Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">
                    {student.student_name}
                  </TableCell>
                  <TableCell>{student.class_name}</TableCell>
                  <TableCell>{student.section_name}</TableCell>
                  <TableCell>
                    <div className="flex items-baseline">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {student.total_fees.toLocaleString('en-IN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline text-green-600">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {student.paid_amount.toLocaleString('en-IN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline text-red-600">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {student.pending_amount.toLocaleString('en-IN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentStatus(
                      student.total_fees,
                      student.paid_amount,
                      student.pending_amount
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setSelectedStudent(student)}
                        >
                          View Payment History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedStudent && (
        <PaymentHistoryDialog
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  )
}
