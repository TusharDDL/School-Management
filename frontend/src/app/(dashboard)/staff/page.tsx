'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  UserPlus,
  ClipboardList,
  Calendar,
  Award,
  FileText,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'

const staffModules = [
  {
    title: 'Staff Directory',
    description: 'Manage staff profiles and information',
    icon: Users,
    href: '/staff/directory',
    color: 'bg-blue-500',
  },
  {
    title: 'Recruitment',
    description: 'Handle staff recruitment process',
    icon: UserPlus,
    href: '/staff/recruitment',
    color: 'bg-green-500',
  },
  {
    title: 'Attendance',
    description: 'Track staff attendance and timings',
    icon: ClipboardList,
    href: '/staff/attendance',
    color: 'bg-purple-500',
  },
  {
    title: 'Leave Management',
    description: 'Manage staff leaves and approvals',
    icon: Calendar,
    href: '/staff/leaves',
    color: 'bg-yellow-500',
  },
  {
    title: 'Performance',
    description: 'Staff performance evaluation',
    icon: Award,
    href: '/staff/performance',
    color: 'bg-red-500',
  },
  {
    title: 'Documents',
    description: 'Staff documents and records',
    icon: FileText,
    href: '/staff/documents',
    color: 'bg-indigo-500',
  },
  {
    title: 'Departments',
    description: 'Manage school departments',
    icon: Briefcase,
    href: '/staff/departments',
    color: 'bg-pink-500',
  },
  {
    title: 'Training',
    description: 'Staff training and development',
    icon: GraduationCap,
    href: '/staff/training',
    color: 'bg-orange-500',
  },
]

export default function StaffPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="text-gray-500">
          Manage staff, departments, and human resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staffModules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start space-x-4">
                <div
                  className={`${module.color} p-3 rounded-lg text-white`}
                >
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-500">
                    {module.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Staff</p>
              <h4 className="text-2xl font-bold">156</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <h4 className="text-2xl font-bold">12</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <h4 className="text-2xl font-bold">8</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Joiners</p>
              <h4 className="text-2xl font-bold">5</h4>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[
              {
                type: 'join',
                name: 'John Smith',
                role: 'Mathematics Teacher',
                date: '2024-01-15',
              },
              {
                type: 'leave',
                name: 'Sarah Johnson',
                days: 3,
                date: '2024-01-14',
              },
              {
                type: 'evaluation',
                name: 'Mike Wilson',
                rating: 4.5,
                date: '2024-01-13',
              },
              {
                type: 'training',
                name: 'Emily Brown',
                course: 'Digital Teaching Methods',
                date: '2024-01-12',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center space-x-3">
                  {activity.type === 'join' && (
                    <div className="bg-green-100 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {activity.type === 'leave' && (
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                  {activity.type === 'evaluation' && (
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'training' && (
                    <div className="bg-purple-100 p-2 rounded-full">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-500">
                      {activity.type === 'join' && (
                        <>Joined as {activity.role}</>
                      )}
                      {activity.type === 'leave' && (
                        <>Applied for {activity.days} days leave</>
                      )}
                      {activity.type === 'evaluation' && (
                        <>Received {activity.rating} rating</>
                      )}
                      {activity.type === 'training' && (
                        <>Completed {activity.course}</>
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
