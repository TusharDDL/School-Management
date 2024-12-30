'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import schoolService, { SchoolRegistration } from '@/services/school'

const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  contact_email: z.string().email('Invalid email'),
  contact_phone: z.string().min(10, 'Invalid phone number'),
  board_affiliation: z.enum(['CBSE', 'ICSE', 'STATE']),
  student_strength: z.number().min(1).max(500, 'Free tier limited to 500 students'),
  staff_count: z.number().min(1).max(50, 'Free tier limited to 50 staff members'),
  principal_name: z.string().min(1, 'Principal name is required'),
  principal_email: z.string().email('Invalid email'),
  principal_phone: z.string().min(10, 'Invalid phone number'),
  academic_year_start: z.number().min(1).max(12),
  academic_year_end: z.number().min(1).max(12),
})

export default function SchoolRegistration() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SchoolRegistration>({
    resolver: zodResolver(schoolSchema),
  })

  const onSubmit = async (data: SchoolRegistration) => {
    try {
      setIsSubmitting(true)
      await schoolService.register(data)
      toast({
        title: 'Registration Successful',
        description: 'Your school registration has been submitted for approval.',
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">School Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input id="contact_email" type="email" {...register('contact_email')} />
            {errors.contact_email && <p className="text-red-500 text-sm">{errors.contact_email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input id="contact_phone" {...register('contact_phone')} />
            {errors.contact_phone && <p className="text-red-500 text-sm">{errors.contact_phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="board_affiliation">Board Affiliation</Label>
            <Select onValueChange={(value) => setValue('board_affiliation', value as 'CBSE' | 'ICSE' | 'STATE')}>
              <SelectTrigger>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
                <SelectItem value="STATE">STATE</SelectItem>
              </SelectContent>
            </Select>
            {errors.board_affiliation && <p className="text-red-500 text-sm">{errors.board_affiliation.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_strength">Student Strength</Label>
            <Input
              id="student_strength"
              type="number"
              {...register('student_strength', { valueAsNumber: true })}
            />
            {errors.student_strength && <p className="text-red-500 text-sm">{errors.student_strength.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff_count">Staff Count</Label>
            <Input
              id="staff_count"
              type="number"
              {...register('staff_count', { valueAsNumber: true })}
            />
            {errors.staff_count && <p className="text-red-500 text-sm">{errors.staff_count.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="principal_name">Principal Name</Label>
            <Input id="principal_name" {...register('principal_name')} />
            {errors.principal_name && <p className="text-red-500 text-sm">{errors.principal_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="principal_email">Principal Email</Label>
            <Input id="principal_email" type="email" {...register('principal_email')} />
            {errors.principal_email && <p className="text-red-500 text-sm">{errors.principal_email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="principal_phone">Principal Phone</Label>
            <Input id="principal_phone" {...register('principal_phone')} />
            {errors.principal_phone && <p className="text-red-500 text-sm">{errors.principal_phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year_start">Academic Year Start Month</Label>
            <Input
              id="academic_year_start"
              type="number"
              min="1"
              max="12"
              {...register('academic_year_start', { valueAsNumber: true })}
            />
            {errors.academic_year_start && <p className="text-red-500 text-sm">{errors.academic_year_start.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year_end">Academic Year End Month</Label>
            <Input
              id="academic_year_end"
              type="number"
              min="1"
              max="12"
              {...register('academic_year_end', { valueAsNumber: true })}
            />
            {errors.academic_year_end && <p className="text-red-500 text-sm">{errors.academic_year_end.message}</p>}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Register School'}
        </Button>
      </form>
    </div>
  )
}
