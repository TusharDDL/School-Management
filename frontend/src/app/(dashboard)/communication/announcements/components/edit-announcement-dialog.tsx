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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Announcement } from '@/services/communication'
import academicService from '@/services/academic'
import communicationService from '@/services/communication'

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['low', 'medium', 'high']),
  target_roles: z.array(z.string()).min(1, 'At least one role is required'),
  target_sections: z.array(z.string()).optional(),
  file: z.any().optional(),
})

type AnnouncementFormData = z.infer<typeof announcementSchema>

interface EditAnnouncementDialogProps {
  announcement: Announcement
}

export function EditAnnouncementDialog({
  announcement,
}: EditAnnouncementDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      target_roles: announcement.target_roles,
      target_sections: announcement.target_sections.map((s) =>
        s.id.toString()
      ),
    },
  })

  const { mutate: updateAnnouncement, isLoading: isUpdating } = useMutation({
    mutationFn: (data: FormData) =>
      communicationService.updateAnnouncement(announcement.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      setOpen(false)
    },
  })

  const { mutate: deleteAnnouncement, isLoading: isDeleting } = useMutation({
    mutationFn: () =>
      communicationService.deleteAnnouncement(announcement.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      setOpen(false)
    },
  })

  const onSubmit = (data: AnnouncementFormData) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('priority', data.priority)
    formData.append('target_roles', JSON.stringify(data.target_roles))
    if (data.target_sections?.length) {
      formData.append(
        'target_sections',
        JSON.stringify(data.target_sections.map((id) => parseInt(id)))
      )
    }
    if (data.file?.[0]) {
      formData.append('attachment', data.file[0])
    }
    updateAnnouncement(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter announcement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter announcement content"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Roles</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = new Set(field.value)
                      if (currentValues.has(value)) {
                        currentValues.delete(value)
                      } else {
                        currentValues.add(value)
                      }
                      field.onChange(Array.from(currentValues))
                    }}
                    value={field.value[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roles" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="school_admin">
                        School Admin
                      </SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((role) => (
                      <div
                        key={role}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <span className="capitalize">
                          {role.replace('_', ' ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(
                              field.value.filter((r) => r !== role)
                            )
                          }}
                          className="text-secondary-foreground/50 hover:text-secondary-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_sections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Sections (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = new Set(field.value)
                      if (currentValues.has(value)) {
                        currentValues.delete(value)
                      } else {
                        currentValues.add(value)
                      }
                      field.onChange(Array.from(currentValues))
                    }}
                    value={field.value?.[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sections" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sections?.map((section) => (
                        <SelectItem
                          key={section.id}
                          value={section.id.toString()}
                        >
                          {section.class_name.name} - {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((sectionId) => {
                      const section = sections?.find(
                        (s) => s.id.toString() === sectionId
                      )
                      if (!section) return null
                      return (
                        <div
                          key={sectionId}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          <span>
                            {section.class_name.name} - {section.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(
                                field.value?.filter(
                                  (id) => id !== sectionId
                                )
                              )
                            }}
                            className="text-secondary-foreground/50 hover:text-secondary-foreground"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Attachment (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  {announcement.attachment && (
                    <div className="mt-2">
                      <a
                        href={announcement.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Current Attachment
                      </a>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this announcement? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteAnnouncement()}
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
