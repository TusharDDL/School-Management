'use client'

import { useAuth } from '@/lib/auth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name}!</h1>
      <p className="text-gray-600">
        This is your dashboard. You can access all your school-related information
        here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Classes</h2>
          <p className="text-blue-600">View your class schedule and materials</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-green-700 mb-2">
            Assignments
          </h2>
          <p className="text-green-600">Check your pending assignments</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">
            Attendance
          </h2>
          <p className="text-purple-600">View your attendance records</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-yellow-700 mb-2">Grades</h2>
          <p className="text-yellow-600">Check your academic performance</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Fees</h2>
          <p className="text-red-600">View and pay your fees</p>
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">
            Announcements
          </h2>
          <p className="text-indigo-600">Stay updated with school news</p>
        </div>
      </div>
    </div>
  )
}
