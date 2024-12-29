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
import { format, addDays } from 'date-fns'
import {
  Plus,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  BookOpen,
  BookCopy,
  Clock,
  Mail,
  MessageSquare,
  ArrowLeftRight,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const circulationSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  book_id: z.string().min(1, 'Book is required'),
  issue_date: z.date({
    required_error: 'Issue date is required',
  }),
  due_date: z.date({
    required_error: 'Due date is required',
  }),
  remarks: z.string().optional(),
})

type CirculationFormData = z.infer<typeof circulationSchema>

export default function CirculationPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCirculation, setSelectedCirculation] = useState<any>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<CirculationFormData>({
    resolver: zodResolver(circulationSchema),
    defaultValues: {
      student_id: '',
      book_id: '',
      remarks: '',
    },
  })

  // Get circulation data
  const { data: circulationData, isLoading } = useQuery({
    queryKey: ['circulation', selectedStatus, searchTerm],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          student: {
            id: '1',
            name: 'John Smith',
            class: 'Class 10',
            section: 'A',
            roll_number: '101',
            avatar: null,
          },
          book: {
            id: '1',
            title: 'Introduction to Physics',
            isbn: '978-3-16-148410-0',
            author: 'Dr. Robert Smith',
            cover_image: null,
          },
          issue_date: '2024-01-15',
          due_date: '2024-01-29',
          return_date: null,
          status: 'issued',
          fine_amount: 0,
        },
        {
          id: 2,
          student: {
            id: '2',
            name: 'Sarah Johnson',
            class: 'Class 10',
            section: 'B',
            roll_number: '102',
            avatar: null,
          },
          book: {
            id: '2',
            title: 'World History',
            isbn: '978-3-16-148410-1',
            author: 'Sarah Williams',
            cover_image: null,
          },
          issue_date: '2024-01-10',
          due_date: '2024-01-24',
          return_date: null,
          status: 'overdue',
          fine_amount: 5,
        },
      ])
    },
  })

  // Get students data
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: '1',
          name: 'John Smith',
          class: 'Class 10',
          section: 'A',
          roll_number: '101',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          class: 'Class 10',
          section: 'B',
          roll_number: '102',
        },
      ])
    },
  })

  // Get books data
  const { data: booksData } = useQuery({
    queryKey: ['available-books'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: '1',
          title: 'Introduction to Physics',
          author: 'Dr. Robert Smith',
          isbn: '978-3-16-148410-0',
          available_copies: 3,
        },
        {
          id: '2',
          title: 'World History',
          author: 'Sarah Williams',
          isbn: '978-3-16-148410-1',
          available_copies: 6,
        },
      ])
    },
  })

  const { mutate: saveCirculation, isLoading: isSaving } = useMutation({
    mutationFn: (data: CirculationFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Book issued successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to issue book.',
        variant: 'destructive',
      })
    },
  })

  const { mutate: returnBook, isLoading: isReturning } = useMutation({
    mutationFn: (circulationId: number) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Book returned successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to return book.',
        variant: 'destructive',
      })
    },
  })

  const { mutate: sendReminder, isLoading: isSending } = useMutation({
    mutationFn: (studentIds: string[]) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Reminder sent successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send reminder.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: CirculationFormData) => {
    saveCirculation(data)
  }

  // Watch the issue date to automatically set due date
  const issueDate = form.watch('issue_date')
  if (issueDate && !form.getValues('due_date')) {
    form.setValue('due_date', addDays(issueDate, 14))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Circulation</h1>
          <p className="text-gray-500">
            Manage book issues and returns
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Issue Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue Book</DialogTitle>
                <DialogDescription>
                  Enter book issue details
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
                            {studentsData?.map((student) => (
                              <SelectItem
                                key={student.id}
                                value={student.id}
                              >
                                {student.name} ({student.roll_number})
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
                    name="book_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select book" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {booksData?.map((book) => (
                              <SelectItem
                                key={book.id}
                                value={book.id}
                                disabled={book.available_copies === 0}
                              >
                                {book.title} ({book.available_copies}{' '}
                                available)
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
                      name="issue_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Issue Date</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                      name="due_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  !issueDate || date <= issueDate
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                          <Input {...field} />
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
                      {isSaving ? 'Issuing...' : 'Issue Book'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Books Issued</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">328</h4>
              <BookCopy className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Books Returned</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">285</h4>
              <ArrowLeftRight className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Overdue Books</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">43</h4>
              <Clock className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Fine</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">$215</h4>
              <BookOpen className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by student or book..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Circulation Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Circulation Records</h2>
            <Button
              variant="outline"
              onClick={() =>
                sendReminder(
                  circulationData
                    ?.filter((c) => c.status === 'overdue')
                    .map((c) => c.student.id)
                )
              }
              disabled={isSending}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fine</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {circulationData?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={record.student.avatar || ''}
                        />
                        <AvatarFallback>
                          {record.student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {record.student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.student.class} -{' '}
                          {record.student.section} | Roll #
                          {record.student.roll_number}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={record.book.cover_image || ''}
                        />
                        <AvatarFallback>
                          {record.book.title[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {record.book.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.book.author}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.issue_date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.due_date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    {record.return_date
                      ? format(new Date(record.return_date), 'PPP')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.status === 'issued'
                          ? 'bg-blue-100 text-blue-700'
                          : record.status === 'returned'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.fine_amount > 0
                      ? `$${record.fine_amount}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.status === 'issued' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => returnBook(record.id)}
                          disabled={isReturning}
                        >
                          Return
                        </Button>
                      )}
                      {record.status === 'overdue' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            sendReminder([record.student.id])
                          }}
                        >
                          <Mail className="h-4 w-4" />
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
    </div>
  )
}
