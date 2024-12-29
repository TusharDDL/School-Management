'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Assessment } from '@/services/academic'
import academicService from '@/services/academic'
import { useAuth } from '@/lib/auth'

interface ViewResultsDialogProps {
  assessment: Assessment
  sectionId: number
}

export function ViewResultsDialog({
  assessment,
  sectionId,
}: ViewResultsDialogProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const { data: results } = useQuery({
    queryKey: ['assessment-results', assessment.id],
    queryFn: () => academicService.getAssessmentResults(assessment.id),
  })

  const userResult = results?.find((r) => r.student.id === user?.id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Results</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Results - {assessment.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {user?.role === 'student' ? (
            userResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Marks Obtained</p>
                    <p className="text-2xl font-bold">
                      {userResult.marks_obtained}/{assessment.total_marks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Percentage</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        (userResult.marks_obtained / assessment.total_marks) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
                {userResult.remarks && (
                  <div>
                    <p className="text-sm text-gray-500">Remarks</p>
                    <p className="mt-1">{userResult.remarks}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No results found
              </div>
            )
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      {result.student.first_name} {result.student.last_name}
                    </TableCell>
                    <TableCell>
                      {result.marks_obtained}/{assessment.total_marks}
                    </TableCell>
                    <TableCell>
                      {Math.round(
                        (result.marks_obtained / assessment.total_marks) * 100
                      )}
                      %
                    </TableCell>
                    <TableCell>{result.remarks}</TableCell>
                  </TableRow>
                ))}
                {!results?.length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
