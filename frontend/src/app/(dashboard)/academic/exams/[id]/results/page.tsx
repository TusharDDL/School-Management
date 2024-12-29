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
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  BarChart2,
} from 'lucide-react'

const resultSchema = z.object({
  marks: z.string().min(1, 'Marks are required'),
  remarks: z.string().optional(),
})

type ResultFormData = z.infer<typeof resultSchema>

export default function ExamResultsPage({
  params,
}: {
  params: { id: string }
}) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const form = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      marks: '',
      remarks: '',
    },
  })

  // Get exam details
  const { data: exam } = useQuery({
    queryKey: ['exam', params.id],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve({
        id: params.id,
        title: 'Mid-Term Mathematics',
        class: 'Class 10',
        subject: 'Mathematics',
        date: '2024-02-15',
        max_marks: 100,
        total_students: 30,
      })
    },
  })

  // Get results data
  const { data: resultsData } = useQuery({
    queryKey: ['results', params.id],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          student_name: 'John Doe',
          roll_number: '1001',
          marks: 85,
          percentage: 85,
          grade: 'A',
          remarks: 'Excellent performance',
          status: 'published',
        },
        {
          id: 2,
          student_name: 'Jane Smith',
          roll_number: '1002',
          marks: 92,
          percentage: 92,
          grade: 'A+',
          remarks: 'Outstanding work',
          status: 'published',
        },
        {
          id: 3,
          student_name: 'Mike Johnson',
          roll_number: '1003',
          marks: null,
          percentage: null,
          grade: null,
          remarks: null,
          status: 'pending',
        },
      ])
    },
  })

  const { mutate: saveResult, isLoading: isSaving } = useMutation({
    mutationFn: (data: ResultFormData & { studentId: number }) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Result saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save result.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: ResultFormData) => {
    if (selectedStudent) {
      saveResult({ ...data, studentId: selectedStudent.id })
    }
  }

  const handleEnterResult = (student: any) => {
    setSelectedStudent(student)
    form.reset({
      marks: student.marks?.toString() || '',
      remarks: student.remarks || '',
    })
    setIsDialogOpen(true)
  }

  const getGradeColor = (grade: string | null) => {
    if (!grade) return ''
    switch (grade) {
      case 'A+':
        return 'text-green-600'
      case 'A':
        return 'text-green-500'
      case 'B':
        return 'text-blue-500'
      case 'C':
        return 'text-yellow-500'
      case 'D':
        return 'text-orange-500'
      case 'F':
        return 'text-red-500'
      default:
        return ''
    }
  }

  // Calculate statistics
  const stats = resultsData?.reduce(
    (acc, result) => {
      if (result.marks !== null) {
        acc.totalMarks += result.marks
        acc.totalStudents += 1
        if (result.percentage >= 90) acc.gradeAPlus += 1
        else if (result.percentage >= 80) acc.gradeA += 1
        else if (result.percentage >= 70) acc.gradeB += 1
        else if (result.percentage >= 60) acc.gradeC += 1
        else if (result.percentage >= 50) acc.gradeD += 1
        else acc.gradeF += 1
      }
      return acc
    },
    {
      totalMarks: 0,
      totalStudents: 0,
      gradeAPlus: 0,
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      gradeD: 0,
      gradeF: 0,
    }
  )

  const averageMarks = stats
    ? Math.round(stats.totalMarks / stats.totalStudents)
    : 0

  return (
    <div className="container mx-auto py-6">
      {/* Exam Details */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{exam?.title}</h1>
              <p className="text-gray-500">
                {exam?.class} | {exam?.subject}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                Date: {format(new Date(exam?.date || ''), 'PPP')}
              </p>
              <p className="text-sm text-gray-500">
                Maximum Marks: {exam?.max_marks}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">
                Average Marks
              </h3>
              <p className="text-2xl font-bold">{averageMarks}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">
                Pass Rate
              </h3>
              <p className="text-2xl font-bold">
                {stats
                  ? Math.round(
                      ((stats.gradeAPlus +
                        stats.gradeA +
                        stats.gradeB +
                        stats.gradeC +
                        stats.gradeD) /
                        stats.totalStudents) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600">
                Highest Grade
              </h3>
              <p className="text-2xl font-bold">
                {stats?.gradeAPlus} Students
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600">
                Failed
              </h3>
              <p className="text-2xl font-bold">
                {stats?.gradeF} Students
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Results</h2>
            <div className="space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <BarChart2 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsData?.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.student_name}</TableCell>
                  <TableCell>{result.roll_number}</TableCell>
                  <TableCell>
                    {result.marks !== null ? (
                      <span className="font-medium">
                        {result.marks}/{exam?.max_marks}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {result.percentage !== null
                      ? `${result.percentage}%`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getGradeColor(
                        result.grade
                      )}`}
                    >
                      {result.grade || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {result.remarks || '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        result.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {result.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEnterResult(result)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Enter Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Result</DialogTitle>
            <DialogDescription>
              Enter marks and remarks for{' '}
              {selectedStudent?.student_name}
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
                        max={exam?.max_marks}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum marks: {exam?.max_marks}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
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
