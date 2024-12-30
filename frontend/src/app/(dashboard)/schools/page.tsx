'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import schoolService, { School } from '@/services/school'

export default function SchoolsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    try {
      const data = await schoolService.getAllSchools()
      setSchools(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load schools',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await schoolService.approveSchool(id)
      toast({
        title: 'Success',
        description: 'School has been approved',
      })
      loadSchools()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to approve school',
        variant: 'destructive',
      })
    }
  }

  const handleReject = async (id: number) => {
    try {
      const reason = prompt('Please provide a reason for rejection:')
      if (!reason) return

      await schoolService.rejectSchool(id, reason)
      toast({
        title: 'Success',
        description: 'School has been rejected',
      })
      loadSchools()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to reject school',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schools Management</h1>
        <Button onClick={() => router.push('/schools/register')}>Register New School</Button>
      </div>

      <div className="grid gap-4">
        {schools.map((school) => (
          <div
            key={school.id}
            className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{school.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{school.address}</p>
                <div className="mt-2 space-y-1">
                  <p>Board: {school.board_affiliation}</p>
                  <p>Students: {school.student_strength}</p>
                  <p>Staff: {school.staff_count}</p>
                  <p>Principal: {school.principal_name}</p>
                  <p>Contact: {school.contact_email} | {school.contact_phone}</p>
                  <p>Academic Year: Month {school.academic_year_start} - Month {school.academic_year_end}</p>
                </div>
              </div>
              <div className="space-x-2">
                {!school.is_approved && (
                  <>
                    <Button
                      onClick={() => handleApprove(school.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(school.id)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {school.is_approved && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Approved
                  </span>
                )}
                {school.rejection_reason && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                    Rejected: {school.rejection_reason}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {schools.length === 0 && (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p>No schools registered yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
