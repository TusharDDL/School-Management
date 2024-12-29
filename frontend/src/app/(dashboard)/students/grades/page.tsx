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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Download,
  FileEdit,
  Mail,
  BarChart2,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const gradeSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  subject: z.string().min(1, 'Subject is required'),
  exam_type: z.string().min(1, 'Exam type is required'),
  marks_obtained: z.string().min(1, 'Marks obtained is required'),
  max_marks: z.string().min(1, 'Maximum marks is required'),
  remarks: z.string().optional(),
})

type GradeFormData = z.infer<typeof gradeSchema>

export default function GradesPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      student_id: '',
      subject: '',
      exam_type: '',
      marks_obtained: '',
      max_marks: '',
      remarks: '',
    },
  })

  // Get grades data
  const { data: gradesData, isLoading } = useQuery({
    queryKey: ['grades', selectedClass, selectedSection, selectedSubject],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          student_id: '1',
          student_name: 'John Smith',
          roll_number: '101',
          class: 'Class 10',
          section: 'A',
          avatar: null,
          subjects: {
            Mathematics: {
              unit_tests: [85, 90, 88],
              mid_term: 92,
              final: 88,
              average: 89,
              grade: 'A',
              trend: 'up',
            },
            Science: {
              unit_tests: [78, 85, 82],
              mid_term: 88,
              final: 85,
              average: 84,
              grade: 'B',
              trend: 'up',
            },
            English: {
              unit_tests: [92, 88, 90],
              mid_term: 95,
              final: 92,
              average: 91,
              grade: 'A+',
              trend: 'stable',
            },
          },
          overall_average: 88,
          overall_grade: 'A',
          rank: 2,
        },
        {
          id: 2,
          student_id: '2',
          student_name: 'Sarah Johnson',
          roll_number: '102',
          class: 'Class 10',
          section: 'A',
          avatar: null,
          subjects: {
            Mathematics: {
              unit_tests: [92, 95, 90],
              mid_term: 94,
              final: 96,
              average: 93,
              grade: 'A+',
              trend: 'up',
            },
            Science: {
              unit_tests: [88, 92, 90],
              mid_term: 90,
              final: 92,
              average: 90,
              grade: 'A',
              trend: 'up',
            },
            English: {
              unit_tests: [85, 88, 86],
              mid_term: 89,
              final: 90,
              average: 88,
              grade: 'A',
              trend: 'up',
            },
          },
          overall_average: 90,
          overall_grade: 'A+',
          rank: 1,
        },
      ])
    },
  })

  // Get class statistics
  const { data: statsData } = useQuery({
    queryKey: ['grade-stats', selectedClass, selectedSection],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve({
        class_average: 85,
        subject_averages: {
          Mathematics: 87,
          Science: 84,
          English: 86,
        },
        grade_distribution: {
          'A+': 5,
          A: 8,
          B: 10,
          C: 5,
          D: 2,
          F: 0,
        },
        performance_trends: {
          improving: 15,
          stable: 10,
          declining: 5,
        },
      })
    },
  })

  const { mutate: saveGrade, isLoading: isSaving } = useMutation({
    mutationFn: (data: GradeFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Grade saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save grade.',
        variant: 'destructive',
      })
    },
  })

  const { mutate: notifyParents, isLoading: isNotifying } = useMutation({
    mutationFn: (studentIds: string[]) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Parents notified successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to notify parents.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: GradeFormData) => {
    saveGrade(data)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Grades</h1>
          <p className="text-gray-500">
            Manage and track student academic performance
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Class Average</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                {statsData?.class_average}%
              </h4>
              <Progress value={statsData?.class_average} className="w-20" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Grade Distribution</p>
            <div className="flex items-center space-x-2">
              {Object.entries(statsData?.grade_distribution || {}).map(
                ([grade, count]) => (
                  <div
                    key={grade}
                    className="flex flex-col items-center"
                  >
                    <span className="text-xs font-medium">{grade}</span>
                    <span className="text-sm">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Performance Trends</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  {statsData?.performance_trends.improving}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Minus className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {statsData?.performance_trends.stable}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  {statsData?.performance_trends.declining}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Subject Averages</p>
            <div className="space-y-1">
              {Object.entries(statsData?.subject_averages || {}).map(
                ([subject, average]) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{subject}</span>
                    <Progress
                      value={average}
                      className="w-20"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or roll number..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Class
              </label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={`Class ${i + 1}`}>
                      Class {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Section
              </label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Subject
              </label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {['Mathematics', 'Science', 'English'].map(
                    (subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Grades Table */}
      <Card>
        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Overall Average</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={student.avatar || ''} />
                            <AvatarFallback>
                              {student.student_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.student_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.class} - {student.section}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {student.overall_average}%
                          </span>
                          <Progress
                            value={student.overall_average}
                            className="w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {student.overall_grade}
                        </span>
                      </TableCell>
                      <TableCell>#{student.rank}</TableCell>
                      <TableCell>
                        {getTrendIcon(
                          Object.values(student.subjects)[0].trend
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // View detailed grades
                            }}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              notifyParents([student.student_id])
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="detailed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Unit Tests</TableHead>
                    <TableHead>Mid Term</TableHead>
                    <TableHead>Final</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData?.map((student) =>
                    Object.entries(student.subjects).map(
                      ([subject, data]) => (
                        <TableRow
                          key={`${student.id}-${subject}`}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.avatar || ''}
                                />
                                <AvatarFallback>
                                  {student.student_name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.student_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {student.roll_number}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{subject}</TableCell>
                          <TableCell>
                            {data.unit_tests.join(', ')}
                          </TableCell>
                          <TableCell>{data.mid_term}</TableCell>
                          <TableCell>{data.final}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {data.average}%
                              </span>
                              <Progress
                                value={data.average}
                                className="w-20"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {data.grade}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getTrendIcon(data.trend)}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Add/Edit Grade Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGrade ? 'Edit' : 'Add'} Grade
            </DialogTitle>
            <DialogDescription>
              Enter grade details for the student
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gradesData?.map((student) => (
                          <SelectItem
                            key={student.student_id}
                            value={student.student_id}
                          >
                            {student.student_name} ({student.roll_number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Mathematics', 'Science', 'English'].map(
                            (subject) => (
                              <SelectItem
                                key={subject}
                                value={subject}
                              >
                                {subject}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exam_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exam type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            'Unit Test 1',
                            'Unit Test 2',
                            'Unit Test 3',
                            'Mid Term',
                            'Final',
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="marks_obtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marks Obtained</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Marks</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
