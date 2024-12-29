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
  Search,
  Filter,
  Download,
  Receipt,
  DollarSign,
  CreditCard,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const feeSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  fee_type: z.string().min(1, 'Fee type is required'),
  amount: z.string().min(1, 'Amount is required'),
  due_date: z.date({
    required_error: 'Due date is required',
  }),
  payment_method: z.string().optional(),
  remarks: z.string().optional(),
})

type FeeFormData = z.infer<typeof feeSchema>

export default function FeesPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      student_id: '',
      fee_type: '',
      amount: '',
      payment_method: '',
      remarks: '',
    },
  })

  // Get fees data
  const { data: feesData, isLoading } = useQuery({
    queryKey: ['fees', selectedClass, selectedStatus],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          student_id: '1',
          student_name: 'John Smith',
          class: 'Class 10',
          section: 'A',
          roll_number: '101',
          avatar: null,
          fee_type: 'Tuition Fee',
          amount: 1200,
          due_date: '2024-01-31',
          status: 'paid',
          payment_date: '2024-01-15',
          payment_method: 'Credit Card',
          transaction_id: 'TXN123456',
        },
        {
          id: 2,
          student_id: '2',
          student_name: 'Sarah Johnson',
          class: 'Class 10',
          section: 'B',
          roll_number: '102',
          avatar: null,
          fee_type: 'Tuition Fee',
          amount: 1200,
          due_date: '2024-01-31',
          status: 'pending',
          payment_date: null,
          payment_method: null,
          transaction_id: null,
        },
      ])
    },
  })

  // Get fee statistics
  const { data: statsData } = useQuery({
    queryKey: ['fee-stats'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve({
        total_fees: 150000,
        collected: 125000,
        pending: 25000,
        overdue: 10000,
        collection_rate: 83,
        payment_methods: {
          'Credit Card': 45,
          'Bank Transfer': 35,
          Cash: 20,
        },
        fee_types: {
          'Tuition Fee': 80000,
          'Transport Fee': 25000,
          'Library Fee': 10000,
          'Lab Fee': 10000,
        },
      })
    },
  })

  const { mutate: saveFee, isLoading: isSaving } = useMutation({
    mutationFn: (data: FeeFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Fee saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save fee.',
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

  const onSubmit = (data: FeeFormData) => {
    saveFee(data)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fee Management</h1>
          <p className="text-gray-500">
            Manage student fees and payments
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
                Add Fee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedFee ? 'Edit' : 'Add'} Fee
                </DialogTitle>
                <DialogDescription>
                  Enter fee details for the student
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
                            {feesData?.map((fee) => (
                              <SelectItem
                                key={fee.student_id}
                                value={fee.student_id}
                              >
                                {fee.student_name} ({fee.roll_number})
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
                    name="fee_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fee Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fee type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              'Tuition Fee',
                              'Transport Fee',
                              'Library Fee',
                              'Lab Fee',
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" />
                        </FormControl>
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
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              'Credit Card',
                              'Bank Transfer',
                              'Cash',
                            ].map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
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
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Fees</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.total_fees.toLocaleString()}
              </h4>
              <DollarSign className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Collection Rate</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                {statsData?.collection_rate}%
              </h4>
              <Progress
                value={statsData?.collection_rate}
                className="w-20"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Pending Fees</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.pending.toLocaleString()}
              </h4>
              <Receipt className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Overdue</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.overdue.toLocaleString()}
              </h4>
              <CreditCard className="h-8 w-8 text-red-500 opacity-50" />
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
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Fee Records */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Fee Records</h2>
            <Button
              variant="outline"
              onClick={() =>
                sendReminder(
                  feesData
                    ?.filter((f) => f.status === 'pending')
                    .map((f) => f.student_id)
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
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feesData?.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={fee.avatar || ''} />
                        <AvatarFallback>
                          {fee.student_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {fee.student_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {fee.class} - {fee.section} | Roll #{fee.roll_number}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{fee.fee_type}</TableCell>
                  <TableCell>
                    ${fee.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {format(new Date(fee.due_date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        fee.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : fee.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {fee.payment_date ? (
                      <div className="space-y-1">
                        <p className="text-sm">
                          Paid on:{' '}
                          {format(new Date(fee.payment_date), 'PPP')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {fee.payment_method} | {fee.transaction_id}
                        </p>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // View/Edit fee details
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Send reminder
                          sendReminder([fee.student_id])
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
        </div>
      </Card>
    </div>
  )
}
