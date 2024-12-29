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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { format, differenceInDays } from 'date-fns'
import {
  Search,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  DollarSign,
  Mail,
  MessageSquare,
  ArrowLeftRight,
  BookOpen,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DueBooksPage() {
  const { toast } = useToast()
  const [selectedDays, setSelectedDays] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Get overdue books data
  const { data: overdueData, isLoading } = useQuery({
    queryKey: ['overdue-books', selectedDays, searchTerm],
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
          issue_date: '2024-01-01',
          due_date: '2024-01-15',
          days_overdue: 5,
          fine_amount: 5,
          reminders_sent: 2,
          last_reminder: '2024-01-18',
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
          issue_date: '2024-01-05',
          due_date: '2024-01-19',
          days_overdue: 1,
          fine_amount: 1,
          reminders_sent: 0,
          last_reminder: null,
        },
      ])
    },
  })

  // Get overdue statistics
  const { data: statsData } = useQuery({
    queryKey: ['overdue-stats'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve({
        total_overdue: 45,
        total_fine: 215,
        books_returned: 285,
        reminders_sent: 125,
        overdue_breakdown: {
          '1-7 days': 25,
          '8-14 days': 12,
          '15-30 days': 6,
          '30+ days': 2,
        },
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Due Books</h1>
          <p className="text-gray-500">
            Track overdue books and manage fines
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() =>
              sendReminder(overdueData?.map((item) => item.student.id))
            }
            disabled={isSending}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send All Reminders
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Overdue</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                {statsData?.total_overdue}
              </h4>
              <Clock className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Fine</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                ${statsData?.total_fine}
              </h4>
              <DollarSign className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Books Returned</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                {statsData?.books_returned}
              </h4>
              <ArrowLeftRight className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Reminders Sent</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">
                {statsData?.reminders_sent}
              </h4>
              <Mail className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      {/* Overdue Breakdown */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Overdue Breakdown
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(statsData?.overdue_breakdown || {}).map(
              ([range, count]) => (
                <div key={range} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{range}</span>
                    <span>{count} books</span>
                  </div>
                  <Progress
                    value={
                      (count / statsData?.total_overdue) * 100
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>
      </Card>

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
                Days Overdue
              </label>
              <Select
                value={selectedDays}
                onValueChange={setSelectedDays}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="1-7">1-7 days</SelectItem>
                  <SelectItem value="8-14">8-14 days</SelectItem>
                  <SelectItem value="15-30">15-30 days</SelectItem>
                  <SelectItem value="30+">30+ days</SelectItem>
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

      {/* Overdue Books Table */}
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Fine</TableHead>
                <TableHead>Reminders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={item.student.avatar || ''}
                        />
                        <AvatarFallback>
                          {item.student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {item.student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.student.class} -{' '}
                          {item.student.section} | Roll #
                          {item.student.roll_number}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={item.book.cover_image || ''}
                        />
                        <AvatarFallback>
                          {item.book.title[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {item.book.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.book.author}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {format(new Date(item.due_date), 'PPP')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Issued:{' '}
                        {format(new Date(item.issue_date), 'PPP')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                        item.days_overdue <= 7
                          ? 'bg-yellow-100 text-yellow-700'
                          : item.days_overdue <= 14
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {item.days_overdue} days
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span>{item.fine_amount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {item.reminders_sent} sent
                      </p>
                      {item.last_reminder && (
                        <p className="text-xs text-gray-500">
                          Last:{' '}
                          {format(
                            new Date(item.last_reminder),
                            'PPP'
                          )}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => returnBook(item.id)}
                        disabled={isReturning}
                      >
                        Return
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          sendReminder([item.student.id])
                        }}
                        disabled={isSending}
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
