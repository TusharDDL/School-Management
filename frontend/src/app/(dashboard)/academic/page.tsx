'use client'

import { useQuery } from '@tanstack/react-query'
import academicService from '@/services/academic'
import { useAuth } from '@/lib/auth'

export default function AcademicOverviewPage() {
  const { user } = useAuth()

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: academicService.getSubjects,
  })

  const { data: assignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: academicService.getAssignments,
  })

  const { data: assessments } = useQuery({
    queryKey: ['assessments'],
    queryFn: academicService.getAssessments,
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Academic Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Classes & Sections */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Classes & Sections</h2>
          <p className="text-3xl font-bold text-blue-600">
            {sections?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Total sections</p>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Subjects</h2>
          <p className="text-3xl font-bold text-green-600">
            {subjects?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Total subjects</p>
        </div>

        {/* Assignments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Assignments</h2>
          <p className="text-3xl font-bold text-purple-600">
            {assignments?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Active assignments</p>
        </div>

        {/* Assessments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Assessments</h2>
          <p className="text-3xl font-bold text-yellow-600">
            {assessments?.length || 0}
          </p>
          <p className="text-sm text-gray-500">Total assessments</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <p className="text-gray-500">No recent activity</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'teacher' && (
            <>
              <button className="p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
                Take Attendance
              </button>
              <button className="p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
                Create Assignment
              </button>
              <button className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors">
                Schedule Assessment
              </button>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <button className="p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
                View Attendance
              </button>
              <button className="p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors">
                View Assignments
              </button>
              <button className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors">
                View Results
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
