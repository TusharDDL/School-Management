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
import {
  Plus,
  FileEdit,
  Trash2,
  Calendar as CalendarIcon,
  FileUp,
  Download,
  Eye,
} from 'lucide-react'

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Exam type is required'),
  class: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  start_time: z.string().min(1, 'Start time is required'),
  duration: z.string().min(1, 'Duration is required'),
  max_marks: z.string().min(1, 'Maximum marks is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  syllabus: z.string().min(1, 'Syllabus is required'),
  venue: z.string().min(1, 'Venue is required'),
})

type ExamFormData = z.infer<typeof examSchema>

export default function ExamsPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<any>(null)

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      type: '',
      class: '',
      subject: '',
      start_time: '',
      duration: '',
      max_marks: '',
      instructions: '',
      syllabus: '',
      venue: '',
    },
  })

  // Get exams data
  const { data: examsData, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          title: 'Mid-Term Mathematics',
          type: 'Mid Term',
          class: 'Class 10',
          subject: 'Mathematics',
          date: '2024-02-15',
          start_time: '09:00',
          duration: '3 hours',
          max_marks: '100',
          instructions: '- Use blue/black pen\n- All questions are compulsory',
          syllabus: 'Chapter 1-5',
          venue: 'Main Hall',
          status: 'scheduled',
        },
        {
          id: 2,
          title: 'Science Unit Test',
          type: 'Unit Test',
          class: 'Class 10',
          subject: 'Science',
          date: '2024-02-20',
          start_time: '10:30',
          duration: '1.5 hours',
          max_marks: '50',
          instructions: '- Write neat and clear\n- Show all working',
          syllabus: 'Chapter 3-4',
          venue: 'Room 101',
          status: 'draft',
        },
      ])
    },
  })

  const { mutate: saveExam, isLoading: isSaving } = useMutation({
    mutationFn: (data: ExamFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Exam saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save exam.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: ExamFormData) => {
    saveExam(data)
  }

  const handleEdit = (exam: any) => {
    setSelectedExam(exam)
    form.reset({
      title: exam.title,
      type: exam.type,
      class: exam.class,
      subject: exam.subject,
      date: new Date(exam.date),
      start_time: exam.start_time,
      duration: exam.duration,
      max_marks: exam.max_marks,
      instructions: exam.instructions,
      syllabus: exam.syllabus,
      venue: exam.venue,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    // This would be replaced with an actual API call
    toast({
      title: 'Success',
      description: 'Exam deleted successfully.',
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Examinations</h1>
          <p className="text-gray-500">
            Schedule and manage examinations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedExam ? 'Edit' : 'Schedule'} Exam
              </DialogTitle>
              <DialogDescription>
                Create or modify exam details
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              'Unit Test',
                              'Mid Term',
                              'Final Term',
                              'Practice Test',
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
                </div>

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
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
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
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
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
                              '1 hour',
                              '1.5 hours',
                              '2 hours',
                              '2.5 hours',
                              '3 hours',
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

                <div className="grid grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="syllabus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Syllabus</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        List the topics and chapters to be covered
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter each instruction on a new line
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
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examsData?.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.type}</TableCell>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>
                    {format(new Date(exam.date), 'PPP')}
                    <br />
                    <span className="text-sm text-gray-500">
                      {exam.start_time}
                    </span>
                  </TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        exam.status === 'scheduled'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(exam)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exam.id)}
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
