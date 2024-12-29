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
import { Plus, FileEdit, Trash2, Download, Upload } from 'lucide-react'

const curriculumSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  objectives: z.string().min(1, 'Learning objectives are required'),
  resources: z.string().optional(),
  assessment: z.string().min(1, 'Assessment criteria is required'),
})

type CurriculumFormData = z.infer<typeof curriculumSchema>

export default function CurriculumPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null)

  const form = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      class: '',
      subject: '',
      title: '',
      description: '',
      objectives: '',
      resources: '',
      assessment: '',
    },
  })

  // Get curriculum data
  const { data: curriculumData, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: () => {
      // This would be replaced with an actual API call
      return Promise.resolve([
        {
          id: 1,
          class: 'Class 10',
          subject: 'Mathematics',
          title: 'Algebra Fundamentals',
          description: 'Basic algebraic concepts and operations',
          objectives: '- Understand variables\n- Solve linear equations\n- Graph functions',
          resources: 'Textbook Chapter 1-3, Online exercises',
          assessment: 'Weekly quizzes, Monthly tests',
          status: 'active',
        },
        {
          id: 2,
          class: 'Class 10',
          subject: 'Science',
          title: 'Forces and Motion',
          description: 'Newton\'s laws of motion and their applications',
          objectives: '- Understand Newton\'s laws\n- Calculate force and acceleration\n- Analyze motion graphs',
          resources: 'Physics lab, Simulation software',
          assessment: 'Lab reports, Project work',
          status: 'draft',
        },
      ])
    },
  })

  const { mutate: saveCurriculum, isLoading: isSaving } = useMutation({
    mutationFn: (data: CurriculumFormData) => {
      // This would be replaced with an actual API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Curriculum saved successfully.',
      })
      setIsDialogOpen(false)
      form.reset()
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save curriculum.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: CurriculumFormData) => {
    saveCurriculum(data)
  }

  const handleEdit = (curriculum: any) => {
    setSelectedCurriculum(curriculum)
    form.reset({
      class: curriculum.class,
      subject: curriculum.subject,
      title: curriculum.title,
      description: curriculum.description,
      objectives: curriculum.objectives,
      resources: curriculum.resources,
      assessment: curriculum.assessment,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    // This would be replaced with an actual API call
    toast({
      title: 'Success',
      description: 'Curriculum deleted successfully.',
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Curriculum Management</h1>
          <p className="text-gray-500">
            Create and manage course curriculum
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Curriculum
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedCurriculum ? 'Edit' : 'Add'} Curriculum
                </DialogTitle>
                <DialogDescription>
                  Create or modify curriculum details
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
                    name="resources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resources</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          List any required textbooks, materials, or online
                          resources
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
                        <FormLabel>Assessment Criteria</FormLabel>
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

      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculumData?.map((curriculum) => (
                <TableRow key={curriculum.id}>
                  <TableCell>{curriculum.class}</TableCell>
                  <TableCell>{curriculum.subject}</TableCell>
                  <TableCell>{curriculum.title}</TableCell>
                  <TableCell>{curriculum.description}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        curriculum.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {curriculum.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(curriculum)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(curriculum.id)}
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
