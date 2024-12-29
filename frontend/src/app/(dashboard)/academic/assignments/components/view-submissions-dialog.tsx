'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Assignment } from '@/services/academic'
import academicService from '@/services/academic'

interface ViewSubmissionsDialogProps {
  assignment: Assignment
  sectionId: number
}

interface GradeSubmissionData {
  submissionId: number
  score: number
  remarks?: string
}

export function ViewSubmissionsDialog({
  assignment,
  sectionId,
}: ViewSubmissionsDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Get section details to get the list of students
  const { data: section } = useQuery({
    queryKey: ['sections', sectionId],
    queryFn: () => academicService.getSections(),
    select: (data) => data.find((s) => s.id === sectionId),
  })

  // Get submissions
  const { data: submissions } = useQuery({
    queryKey: ['assignment-submissions', assignment.id],
    queryFn: () => academicService.getAssignmentSubmissions(assignment.id),
  })

  const { mutate: gradeSubmission, isLoading } = useMutation({
    mutationFn: ({ submissionId, ...data }: GradeSubmissionData) =>
      academicService.gradeAssignment(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignment-submissions', assignment.id],
      })
    },
  })

  const handleGrade = (submissionId: number, score: number, remarks?: string) => {
    gradeSubmission({ submissionId, score, remarks })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Submissions</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Submissions - {assignment.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section?.students?.map((student) => {
                const submission = submissions?.find(
                  (s) => s.student.id === student.id
                )

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>
                      {submission ? (
                        <Badge variant="outline">Submitted</Badge>
                      ) : (
                        <Badge variant="destructive">Missing</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission?.submitted_at &&
                        format(
                          new Date(submission.submitted_at),
                          'MMM d, yyyy h:mm a'
                        )}
                    </TableCell>
                    <TableCell>
                      {submission && (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={submission.score || ''}
                          onChange={(e) => {
                            const score = parseInt(e.target.value)
                            if (
                              !isNaN(score) &&
                              score >= 0 &&
                              score <= 100
                            ) {
                              handleGrade(
                                submission.id,
                                score,
                                submission.remarks
                              )
                            }
                          }}
                          className="w-20"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {submission && (
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={submission.file}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </Button>
                          <Input
                            placeholder="Add remarks"
                            value={submission.remarks || ''}
                            onChange={(e) =>
                              handleGrade(
                                submission.id,
                                submission.score || 0,
                                e.target.value
                              )
                            }
                            className="w-40 inline-block"
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
