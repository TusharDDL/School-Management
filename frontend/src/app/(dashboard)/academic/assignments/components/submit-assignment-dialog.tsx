'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Assignment } from '@/services/academic'
import academicService from '@/services/academic'
import { useAuth } from '@/lib/auth'

const submissionSchema = z.object({
  file: z.any().refine((files) => files?.length === 1, 'File is required'),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

interface SubmitAssignmentDialogProps {
  assignment: Assignment
  sectionId: number
}

export function SubmitAssignmentDialog({
  assignment,
  sectionId,
}: SubmitAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Get existing submission
  const { data: submissions } = useQuery({
    queryKey: ['assignment-submissions', assignment.id],
    queryFn: () => academicService.getAssignmentSubmissions(assignment.id),
  })

  const userSubmission = submissions?.find(
    (s) => s.student.id === user?.id
  )

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  })

  const { mutate: submitAssignment, isLoading } = useMutation({
    mutationFn: (data: FormData) =>
      academicService.submitAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignment-submissions', assignment.id],
      })
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = (data: SubmissionFormData) => {
    const formData = new FormData()
    formData.append('assignment_id', assignment.id.toString())
    formData.append('file', data.file[0])
    submitAssignment(formData)
  }

  const isOverdue = new Date(assignment.due_date) < new Date()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={userSubmission ? 'outline' : 'default'}
          disabled={isOverdue && !userSubmission}
        >
          {userSubmission ? 'Update Submission' : 'Submit'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Assignment - {assignment.title}</DialogTitle>
        </DialogHeader>

        {userSubmission && (
          <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold mb-2">Previous Submission</h3>
            <div className="flex items-center justify-between">
              <a
                href={userSubmission.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Submission
              </a>
              {userSubmission.score !== null && (
                <div className="text-sm">
                  Score: {userSubmission.score}/100
                </div>
              )}
            </div>
            {userSubmission.remarks && (
              <p className="mt-2 text-sm text-gray-600">
                {userSubmission.remarks}
              </p>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Assignment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
