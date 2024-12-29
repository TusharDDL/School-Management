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
  BookOpen,
  BookCopy,
  Eye,
  QrCode,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  category: z.string().min(1, 'Category is required'),
  edition: z.string().optional(),
  publication_year: z.string().min(1, 'Publication year is required'),
  copies: z.string().min(1, 'Number of copies is required'),
  price: z.string().min(1, 'Price is required'),
  location: z.string().min(1, 'Shelf location is required'),
  description: z.string().optional(),
  cover_image: z.any().optional(),
})

type BookFormData = z.infer<typeof bookSchema>

export default function BookCatalogPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      isbn: '',
      author: '',
      publisher: '',
      category: '',
      edition: '',
      publication_year: '',
      copies: '',
      price: '',
      location: '',
      description: '',
    },
  })

  // Get books data
  const { data: booksData, isLoading } = useQuery({
    queryKey: ['books', selectedCategory, searchTerm],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          title: 'Introduction to Physics',
          isbn: '978-3-16-148410-0',
          author: 'Dr. Robert Smith',
          publisher: 'Academic Press',
          category: 'Science',
          edition: '3rd Edition',
          publication_year: '2023',
          copies: 5,
          available_copies: 3,
          price: 49.99,
          location: 'Shelf A-12',
          description:
            'A comprehensive introduction to physics for high school students.',
          cover_image: null,
          status: 'available',
        },
        {
          id: 2,
          title: 'World History',
          isbn: '978-3-16-148410-1',
          author: 'Sarah Williams',
          publisher: 'History Books Inc.',
          category: 'History',
          edition: '2nd Edition',
          publication_year: '2022',
          copies: 8,
          available_copies: 6,
          price: 39.99,
          location: 'Shelf B-5',
          description:
            'An in-depth look at world history from ancient times to modern era.',
          cover_image: null,
          status: 'available',
        },
      ])
    },
  })

  // Get categories data
  const { data: categoriesData } = useQuery({
    queryKey: ['book-categories'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        'Science',
        'Mathematics',
        'History',
        'Literature',
        'Technology',
        'Arts',
      ])
    },
  })

  const { mutate: saveBook, isLoading: isSaving } = useMutation({
    mutationFn: (data: BookFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Book saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save book.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: BookFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (key === 'cover_image' && value[0]) {
          formData.append(key, value[0])
        } else {
          formData.append(key, value)
        }
      }
    })
    saveBook(data)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Book Catalog</h1>
          <p className="text-gray-500">
            Manage library books and resources
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
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedBook ? 'Edit' : 'Add'} Book
                </DialogTitle>
                <DialogDescription>
                  Enter book details
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Basic Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
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

                      <FormField
                        control={form.control}
                        name="isbn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ISBN</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="publisher"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publisher</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                                {categoriesData?.map((category) => (
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
                        name="edition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Edition</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="publication_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publication Year</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Inventory Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Inventory Information
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="copies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Copies</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shelf Location</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Additional Information
                    </h3>

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
                      name="cover_image"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Cover Image</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files)}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
            <p className="text-sm text-gray-500">Total Books</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">5,234</h4>
              <BookOpen className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Available Books</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">4,567</h4>
              <BookCopy className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Categories</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">24</h4>
              <Filter className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Value</p>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">$45,678</h4>
              <QrCode className="h-8 w-8 text-yellow-500 opacity-50" />
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
                  placeholder="Search by title, author, or ISBN..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                  {categoriesData?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
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

      {/* Books Table */}
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booksData?.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={book.cover_image || ''} />
                        <AvatarFallback>
                          {book.title[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-gray-500">
                          {book.edition}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {book.available_copies} / {book.copies} available
                      </p>
                      <Progress
                        value={
                          (book.available_copies / book.copies) * 100
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>{book.location}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        book.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {book.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // View book details
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Edit book
                          setSelectedBook(book)
                          form.reset({
                            title: book.title,
                            isbn: book.isbn,
                            author: book.author,
                            publisher: book.publisher,
                            category: book.category,
                            edition: book.edition,
                            publication_year:
                              book.publication_year,
                            copies: book.copies.toString(),
                            price: book.price.toString(),
                            location: book.location,
                            description: book.description,
                          })
                          setIsDialogOpen(true)
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Delete book
                        }}
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
