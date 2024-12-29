'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import academicService from '@/services/academic'

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  class_name_id: z.string().min(1, 'Class is required'),
  teacher_id: z.string().min(1, 'Teacher is required'),
  academic_year_id: z.string().min(1, 'Academic year is required'),
})

type SectionFormData = z.infer<typeof sectionSchema>

export function AddSectionDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: academicService.getClasses,
  })

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => {
      // TODO: Implement teacher fetching
      return []
    },
  })

  const { data: academicYears } = useQuery({
    queryKey: ['academicYears'],
    queryFn: academicService.getAcademicYears,
  })

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: '',
      class_name_id: '',
      teacher_id: '',
      academic_year_id: '',
    },
  })

  const { mutate: createSection, isLoading } = useMutation({
    mutationFn: (data: SectionFormData) =>
      academicService.createSection({
        ...data,
        class_name_id: parseInt(data.class_name_id),
        teacher_id: parseInt(data.teacher_id),
        academic_year_id: parseInt(data.academic_year_id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = (data: SectionFormData) => {
    createSection(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Section</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class_name_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
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
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Teacher</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers?.map((teacher) => (
                        <SelectItem
                          key={teacher.id}
                          value={teacher.id.toString()}
                        >
                          {teacher.first_name} {teacher.last_name}
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
              name="academic_year_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicYears?.map((year) => (
                        <SelectItem key={year.id} value={year.id.toString()}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Section'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
