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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Plus, FileEdit, Trash2, Calendar as CalendarIcon } from 'lucide-react'

const lessonSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  duration: z.string().min(1, 'Duration is required'),
  objectives: z.string().min(1, 'Learning objectives are required'),
  activities: z.string().min(1, 'Activities are required'),
  resources: z.string().optional(),
  homework: z.string().optional(),
  assessment: z.string().min(1, 'Assessment criteria is required'),
})

type LessonFormData = z.infer<typeof lessonSchema>

export default function LessonsPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      class: '',
      subject: '',
      topic: '',
      duration: '',
      objectives: '',
      activities: '',
      resources: '',
      homework: '',
      assessment: '',
    },
  })

  // Get lessons data
  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          class: 'Class 10',
          subject: 'Mathematics',
          topic: 'Quadratic Equations',
          date: '2024-01-15',
          duration: '45 minutes',
          objectives: '- Understand quadratic equations\n- Solve using factorization\n- Apply in real-world problems',
          activities: 'Interactive examples, Group problem-solving',
          resources: 'Textbook, Online calculator',
          homework: 'Practice problems: Page 45-46',
          assessment: 'Class participation, Homework review',
          status: 'upcoming',
        },
        {
          id: 2,
          class: 'Class 10',
          subject: 'Science',
          topic: 'Chemical Reactions',
          date: '2024-01-16',
          duration: '60 minutes',
          objectives: '- Types of reactions\n- Balancing equations\n- Lab safety',
          activities: 'Lab demonstration, Worksheet',
          resources: 'Lab equipment, Safety gear',
          homework: 'Lab report preparation',
          assessment: 'Lab performance, Report quality',
          status: 'completed',
        },
      ])
    },
  })

  const { mutate: saveLesson, isLoading: isSaving } = useMutation({
    mutationFn: (data: LessonFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Lesson plan saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save lesson plan.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: LessonFormData) => {
    saveLesson(data)
  }

  const handleEdit = (lesson: any) => {
    setSelectedLesson(lesson)
    form.reset({
      class: lesson.class,
      subject: lesson.subject,
      topic: lesson.topic,
      date: new Date(lesson.date),
      duration: lesson.duration,
      objectives: lesson.objectives,
      activities: lesson.activities,
      resources: lesson.resources,
      homework: lesson.homework,
      assessment: lesson.assessment,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    // This would be replaced with an actual API call
    toast({
      title: 'Success',
      description: 'Lesson plan deleted successfully.',
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lesson Plans</h1>
          <p className="text-gray-500">
            Create and manage lesson plans
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedLesson ? 'Edit' : 'Add'} Lesson Plan
              </DialogTitle>
              <DialogDescription>
                Create or modify lesson plan details
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={`Class ${i + 1}`}
                              >
                                Class {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {[
                              'Mathematics',
                              'Science',
                              'English',
                              'History',
                              'Geography',
                            ].map((subject) => (
                              <SelectItem
                                key={subject}
                                value={subject}
                              >
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && 'text-muted-foreground'
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              '30 minutes',
                              '45 minutes',
                              '60 minutes',
                              '90 minutes',
                              '120 minutes',
                            ].map((duration) => (
                              <SelectItem
                                key={duration}
                                value={duration}
                              >
                                {duration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Objectives</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter each objective on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activities</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        List the planned activities and teaching methods
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resources</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        List any required materials or resources
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Homework</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Specify any homework assignments
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe how student learning will be assessed
                      </FormDescription>
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

      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonsData?.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    {format(new Date(lesson.date), 'PPP')}
                  </TableCell>
                  <TableCell>{lesson.class}</TableCell>
                  <TableCell>{lesson.subject}</TableCell>
                  <TableCell>{lesson.topic}</TableCell>
                  <TableCell>{lesson.duration}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        lesson.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lesson)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
