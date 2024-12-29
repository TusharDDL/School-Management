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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Timetable } from '@/services/academic'
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

interface EditTimetableEntryDialogProps {
  entry: Timetable
  sectionId: number
}

export function EditTimetableEntryDialog({
  entry,
  sectionId,
}: EditTimetableEntryDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: subjects } = useQuery({
    queryKey: ['subjects', sectionId],
    queryFn: academicService.getSubjects,
  })

  const form = useForm<TimetableEntryFormData>({
    resolver: zodResolver(timetableEntrySchema),
    defaultValues: {
      subject_id: entry.subject.id.toString(),
      weekday: entry.weekday.toString(),
      start_time: entry.start_time,
      end_time: entry.end_time,
    },
  })

  const { mutate: updateEntry, isLoading: isUpdating } = useMutation({
    mutationFn: (data: TimetableEntryFormData) =>
      academicService.updateTimetableEntry(entry.id, {
        ...data,
        section_id: sectionId,
        subject_id: parseInt(data.subject_id),
        weekday: parseInt(data.weekday),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] })
      setOpen(false)
    },
  })

  const { mutate: deleteEntry, isLoading: isDeleting } = useMutation({
    mutationFn: () => academicService.deleteTimetableEntry(entry.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] })
      setOpen(false)
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

    updateEntry(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
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

            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Class</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this class? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteEntry()}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
