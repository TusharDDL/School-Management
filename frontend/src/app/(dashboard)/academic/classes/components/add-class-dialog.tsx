'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Textarea } from '@/components/ui/textarea'
import academicService from '@/services/academic'

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
})

type ClassFormData = z.infer<typeof classSchema>

export function AddClassDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { mutate: createClass, isLoading } = useMutation({
    mutationFn: academicService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = (data: ClassFormData) => {
    createClass(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Class</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Class 10" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter class description"
                      {...field}
                    />
                  </FormControl>
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
                {isLoading ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
