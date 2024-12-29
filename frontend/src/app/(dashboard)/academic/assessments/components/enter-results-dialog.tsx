'use client'

import { useState } from 'react'
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
import { Assessment } from '@/services/academic'
import academicService from '@/services/academic'

interface EnterResultsDialogProps {
  assessment: Assessment
  sectionId: number
}

interface ResultRecord {
  student_id: number
  marks_obtained: number
  remarks?: string
}

export function EnterResultsDialog({
  assessment,
  sectionId,
}: EnterResultsDialogProps) {
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<Record<number, ResultRecord>>({})
  const queryClient = useQueryClient()

  // Get section details to get the list of students
  const { data: section } = useQuery({
    queryKey: ['sections', sectionId],
    queryFn: () => academicService.getSections(),
    select: (data) => data.find((s) => s.id === sectionId),
  })

  // Get existing results
  const { data: existingResults } = useQuery({
    queryKey: ['assessment-results', assessment.id],
    queryFn: () => academicService.getAssessmentResults(assessment.id),
  })

  // Initialize results when dialog opens
  const initializeResults = () => {
    const records: Record<number, ResultRecord> = {}
    section?.students?.forEach((student) => {
      const existing = existingResults?.find(
        (r) => r.student.id === student.id
      )
      records[student.id] = {
        student_id: student.id,
        marks_obtained: existing?.marks_obtained ?? 0,
        remarks: existing?.remarks ?? '',
      }
    })
    setResults(records)
  }

  const { mutate: submitResults, isLoading } = useMutation({
    mutationFn: (data: ResultRecord[]) =>
      academicService.submitAssessmentResults(
        data.map((result) => ({
          ...result,
          assessment_id: assessment.id,
        }))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assessment-results', assessment.id],
      })
      setOpen(false)
    },
  })

  const handleSubmit = () => {
    submitResults(Object.values(results))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) {
          initializeResults()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Enter Results</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Enter Results - {assessment.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Marks (/{assessment.total_marks})</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section?.students?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={assessment.total_marks}
                      value={results[student.id]?.marks_obtained || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (
                          !isNaN(value) &&
                          value >= 0 &&
                          value <= assessment.total_marks
                        ) {
                          setResults((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              marks_obtained: value,
                            },
                          }))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={results[student.id]?.remarks || ''}
                      onChange={(e) => {
                        setResults((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            remarks: e.target.value,
                          },
                        }))
                      }}
                      placeholder="Optional remarks"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Results'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
