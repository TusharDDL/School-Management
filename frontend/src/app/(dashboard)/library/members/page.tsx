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
import { format, addYears } from 'date-fns'
import {
  Plus,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  Users,
  BookOpen,
  Clock,
  CreditCard,
  Eye,
  FileEdit,
  Trash2,
  QrCode,
  Mail,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const memberSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  membership_type: z.string().min(1, 'Membership type is required'),
  start_date: z.date({
    required_error: 'Start date is required',
  }),
  end_date: z.date({
    required_error: 'End date is required',
  }),
  max_books: z.string().min(1, 'Maximum books is required'),
  remarks: z.string().optional(),
})

type MemberFormData = z.infer<typeof memberSchema>

export default function LibraryMembersPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      student_id: '',
      membership_type: '',
      max_books: '',
      remarks: '',
    },
  })

  // Get members data
  const { data: membersData, isLoading } = useQuery({
    queryKey: ['library-members', selectedStatus, searchTerm],
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
          membership_type: 'Standard',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          max_books: 5,
          books_borrowed: 2,
          total_borrowed: 15,
          total_returned: 13,
          total_overdue: 1,
          total_fine: 5,
          status: 'active',
          card_number: 'LIB-2024-001',
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
          membership_type: 'Premium',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          max_books: 8,
          books_borrowed: 3,
          total_borrowed: 20,
          total_returned: 17,
          total_overdue: 0,
          total_fine: 0,
          status: 'active',
          card_number: 'LIB-2024-002',
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

  const { mutate: saveMember, isLoading: isSaving } = useMutation({
    mutationFn: (data: MemberFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Member saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save member.',
        variant: 'destructive',
      })
    },
  })

  const { mutate: deactivateMember, isLoading: isDeactivating } = useMutation({
    mutationFn: (memberId: number) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Member deactivated successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to deactivate member.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: MemberFormData) => {
    saveMember(data)
  }

  // Watch the start date to automatically set end date
  const startDate = form.watch('start_date')
  if (startDate && !form.getValues('end_date')) {
    form.setValue('end_date', addYears(startDate, 1))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Library Members</h1>
          <p className="text-gray-500">
            Manage library memberships and cards
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
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedMember ? 'Edit' : 'Add'} Member
                </DialogTitle>
                <DialogDescription>
                  Enter membership details
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
                    name="membership_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Membership Type</FormLabel>
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
                              'Standard',
                              'Premium',
                              'VIP',
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
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
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
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
                                  !startDate || date <= startDate
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
                    name="max_books"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Books</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" />
                        </FormControl>
                        <FormDescription>
                          Maximum number of books that can be borrowed at
                          once
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
                      {isSaving ? 'Saving...' : 'Save'}
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
            <p className="text-sm text-gray-500">Total Members</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">1,245</h4>
              <Users className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Active Members</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">1,156</h4>
              <CreditCard className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Books Borrowed</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">328</h4>
              <BookOpen className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Fine</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">$215</h4>
              <Clock className="h-8 w-8 text-red-500 opacity-50" />
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
                  placeholder="Search by name or card number..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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

      {/* Members Table */}
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>History</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersData?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={member.student.avatar || ''}
                        />
                        <AvatarFallback>
                          {member.student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.student.class} -{' '}
                          {member.student.section} | Roll #
                          {member.student.roll_number}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4 text-gray-500" />
                      <span>{member.card_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {member.membership_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        Valid till:{' '}
                        {format(new Date(member.end_date), 'PPP')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {member.books_borrowed} / {member.max_books}{' '}
                        borrowed
                      </p>
                      <Progress
                        value={
                          (member.books_borrowed / member.max_books) *
                          100
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {member.total_borrowed} borrowed
                      </p>
                      <p className="text-sm">
                        {member.total_returned} returned
                      </p>
                      <p className="text-sm text-red-500">
                        {member.total_overdue} overdue
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : member.status === 'expired'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // View member details
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Edit member
                          setSelectedMember(member)
                          form.reset({
                            student_id: member.student.id,
                            membership_type: member.membership_type,
                            start_date: new Date(member.start_date),
                            end_date: new Date(member.end_date),
                            max_books: member.max_books.toString(),
                          })
                          setIsDialogOpen(true)
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      {member.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deactivateMember(member.id)}
                          disabled={isDeactivating}
                        >
                          <Trash2 className="h-4 w-4" />
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
