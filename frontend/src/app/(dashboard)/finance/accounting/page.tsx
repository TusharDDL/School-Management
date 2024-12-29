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
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  BarChart2,
  FileText,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const transactionSchema = z.object({
  type: z.string().min(1, 'Transaction type is required'),
  category: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  description: z.string().min(1, 'Description is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
  reference: z.string().optional(),
  attachment: z.any().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export default function AccountingPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([
    undefined,
    undefined,
  ])

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: '',
      category: '',
      amount: '',
      description: '',
      payment_method: '',
      reference: '',
    },
  })

  // Get transactions data
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions', selectedType, selectedCategory, dateRange],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          type: 'income',
          category: 'Fees',
          amount: 5000,
          date: '2024-01-15',
          description: 'Student fees collection',
          payment_method: 'Bank Transfer',
          reference: 'TXN123456',
          status: 'completed',
        },
        {
          id: 2,
          type: 'expense',
          category: 'Utilities',
          amount: 1200,
          date: '2024-01-14',
          description: 'Electricity bill payment',
          payment_method: 'Bank Transfer',
          reference: 'BILL789012',
          status: 'completed',
        },
      ])
    },
  })

  // Get accounting statistics
  const { data: statsData } = useQuery({
    queryKey: ['accounting-stats'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve({
        total_income: 150000,
        total_expenses: 85000,
        net_profit: 65000,
        profit_margin: 43,
        expense_breakdown: {
          Salaries: 45000,
          Utilities: 15000,
          Supplies: 10000,
          Maintenance: 8000,
          Others: 7000,
        },
        income_breakdown: {
          'Tuition Fees': 100000,
          'Transport Fees': 25000,
          'Library Fees': 15000,
          Others: 10000,
        },
        monthly_trend: {
          income: [120000, 125000, 130000, 150000],
          expenses: [70000, 75000, 80000, 85000],
        },
      })
    },
  })

  const { mutate: saveTransaction, isLoading: isSaving } = useMutation({
    mutationFn: (data: TransactionFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Transaction saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save transaction.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: TransactionFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (key === 'attachment' && value[0]) {
          formData.append(key, value[0])
        } else if (key === 'date') {
          formData.append(key, format(value, 'yyyy-MM-dd'))
        } else {
          formData.append(key, value)
        }
      }
    })
    saveTransaction(data)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Accounting</h1>
          <p className="text-gray-500">
            Track income, expenses, and financial records
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
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTransaction ? 'Edit' : 'Add'} Transaction
                </DialogTitle>
                <DialogDescription>
                  Enter transaction details
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
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
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">
                              Expense
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {form.watch('type') === 'income'
                              ? [
                                  'Tuition Fees',
                                  'Transport Fees',
                                  'Library Fees',
                                  'Others',
                                ]
                              : [
                                  'Salaries',
                                  'Utilities',
                                  'Supplies',
                                  'Maintenance',
                                  'Others',
                                ].map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category}
                                  >
                                    {category}
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
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
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
                              'Cash',
                              'Bank Transfer',
                              'Credit Card',
                              'Cheque',
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
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Transaction reference or receipt number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload receipt or supporting document
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
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Income</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.total_income.toLocaleString()}
              </h4>
              <ArrowUpRight className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.total_expenses.toLocaleString()}
              </h4>
              <ArrowDownRight className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Net Profit</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.net_profit.toLocaleString()}
              </h4>
              <DollarSign className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Profit Margin</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                {statsData?.profit_margin}%
              </h4>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Income Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(statsData?.income_breakdown || {}).map(
              ([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>${amount.toLocaleString()}</span>
                  </div>
                  <Progress
                    value={
                      (Number(amount) / statsData?.total_income) * 100
                    }
                  />
                </div>
              )
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Expense Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(statsData?.expense_breakdown || {}).map(
              ([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>${amount.toLocaleString()}</span>
                  </div>
                  <Progress
                    value={
                      (Number(amount) / statsData?.total_expenses) *
                      100
                    }
                  />
                </div>
              )
            )}
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
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Type
              </label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {[
                    'Tuition Fees',
                    'Transport Fees',
                    'Library Fees',
                    'Salaries',
                    'Utilities',
                    'Supplies',
                    'Maintenance',
                    'Others',
                  ].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dateRange[0] && dateRange[1]
                      ? `${format(dateRange[0], 'PP')} - ${format(
                          dateRange[1],
                          'PP'
                        )}`
                      : 'Pick a date range'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange[0],
                      to: dateRange[1],
                    }}
                    onSelect={(range) =>
                      setDateRange([range?.from, range?.to])
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsData?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.date), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span
                      className={
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      ${transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.payment_method}</TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // View/Edit transaction
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // View receipt/document
                        }}
                      >
                        <FileText className="h-4 w-4" />
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
