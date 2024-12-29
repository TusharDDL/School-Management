'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import academicService from '@/services/academic'

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const timetableEntrySchema = z.object({
  subject_id: z.string().min(1, 'Subject is required'),
  weekday: z.string().min(1, 'Day is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
})

type TimetableEntryFormData = z.infer<typeof timetableEntrySchema>

interface AddTimetableEntryDialogProps {
  sectionId: number
}

export function AddTimetableEntryDialog({
  sectionId,
}: AddTimetableEntryDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: subjects } = useQuery({
    queryKey: ['subjects', sectionId],
    queryFn: academicService.getSubjects,
  })

  const form = useForm<TimetableEntryFormData>({
    resolver: zodResolver(timetableEntrySchema),
    defaultValues: {
      subject_id: '',
      weekday: '',
      start_time: '',
      end_time: '',
    },
  })

  const { mutate: createEntry, isLoading } = useMutation({
    mutationFn: (data: TimetableEntryFormData) =>
      academicService.createTimetableEntry({
        ...data,
        section_id: sectionId,
        subject_id: parseInt(data.subject_id),
        weekday: parseInt(data.weekday),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] })
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = (data: TimetableEntryFormData) => {
    // Check if end time is after start time
    const start = new Date(`1970-01-01T${data.start_time}`)
    const end = new Date(`1970-01-01T${data.end_time}`)
    if (end <= start) {
      form.setError('end_time', {
        message: 'End time must be after start time',
      })
      return
    }

    createEntry(data)
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
              name="subject_id"
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
                      {subjects?.map((subject) => (
                        <SelectItem
                          key={subject.id}
                          value={subject.id.toString()}
                        >
                          {subject.name}
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
              name="weekday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WEEKDAYS.map((day, index) => (
                        <SelectItem
                          key={index}
                          value={index.toString()}
                        >
                          {day}
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
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Class'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
