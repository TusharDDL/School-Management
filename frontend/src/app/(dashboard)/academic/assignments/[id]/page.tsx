'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import {
  Download,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'

const gradingSchema = z.object({
  marks: z.string().min(1, 'Marks are required'),
  feedback: z.string().min(1, 'Feedback is required'),
})

type GradingFormData = z.infer<typeof gradingSchema>

export default function AssignmentSubmissionsPage({
  params,
}: {
  params: { id: string }
}) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)

  const form = useForm<GradingFormData>({
    resolver: zodResolver(gradingSchema),
    defaultValues: {
      marks: '',
      feedback: '',
    },
  })

  // Get assignment details
  const { data: assignment } = useQuery({
    queryKey: ['assignment', params.id],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve({
        id: params.id,
        title: 'Quadratic Equations Practice',
        class: 'Class 10',
        subject: 'Mathematics',
        max_marks: 50,
        due_date: '2024-01-20',
        total_students: 30,
      })
    },
  })

  // Get submissions data
  const { data: submissionsData } = useQuery({
    queryKey: ['submissions', params.id],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          student_name: 'John Doe',
          roll_number: '1001',
          submitted_at: '2024-01-19T14:30:00',
          status: 'submitted',
          file: 'john_doe_assignment.pdf',
          marks: null,
          feedback: null,
        },
        {
          id: 2,
          student_name: 'Jane Smith',
          roll_number: '1002',
          submitted_at: '2024-01-19T15:45:00',
          status: 'graded',
          file: 'jane_smith_assignment.pdf',
          marks: 45,
          feedback: 'Excellent work! Clear explanations and neat presentation.',
        },
        {
          id: 3,
          student_name: 'Mike Johnson',
          roll_number: '1003',
          status: 'pending',
          submitted_at: null,
          file: null,
          marks: null,
          feedback: null,
        },
      ])
    },
  })

  const { mutate: saveGrading, isLoading: isSaving } = useMutation({
    mutationFn: (data: GradingFormData & { submissionId: number }) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Grading saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save grading.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: GradingFormData) => {
    if (selectedSubmission) {
      saveGrading({ ...data, submissionId: selectedSubmission.id })
    }
  }

  const handleGrade = (submission: any) => {
    setSelectedSubmission(submission)
    form.reset({
      marks: submission.marks?.toString() || '',
      feedback: submission.feedback || '',
    })
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="flex items-center text-blue-600">
            <Clock className="h-4 w-4 mr-1" />
            Submitted
          </span>
        )
      case 'graded':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Graded
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            Pending
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      {/* Assignment Details */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{assignment?.title}</h1>
              <p className="text-gray-500">
                {assignment?.class} | {assignment?.subject}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                Due Date: {format(new Date(assignment?.due_date || ''), 'PPP')}
              </p>
              <p className="text-sm text-gray-500">
                Maximum Marks: {assignment?.max_marks}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">
                Total Students
              </h3>
              <p className="text-2xl font-bold">
                {assignment?.total_students}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">
                Submitted
              </h3>
              <p className="text-2xl font-bold">
                {submissionsData?.filter((s) => s.status !== 'pending').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-600">
                Pending
              </h3>
              <p className="text-2xl font-bold">
                {submissionsData?.filter((s) => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Submissions Table */}
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionsData?.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.student_name}</TableCell>
                  <TableCell>{submission.roll_number}</TableCell>
                  <TableCell>
                    {submission.submitted_at
                      ? format(
                          new Date(submission.submitted_at),
                          'PPP p'
                        )
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(submission.status)}
                  </TableCell>
                  <TableCell>
                    {submission.marks !== null ? (
                      <span className="font-medium">
                        {submission.marks}/{assignment?.max_marks}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {submission.file && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Handle view submission
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Handle download
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {submission.status === 'submitted' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGrade(submission)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Grading Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Enter marks and feedback for{' '}
              {selectedSubmission?.student_name}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max={assignment?.max_marks}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum marks: {assignment?.max_marks}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
