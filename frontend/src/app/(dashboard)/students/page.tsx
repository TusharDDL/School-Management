'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  UserPlus,
  ClipboardList,
  GraduationCap,
  FileText,
  BookOpen,
  Activity,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

const studentModules = [
  {
    title: 'Student Directory',
    description: 'View and manage student profiles',
    icon: Users,
    href: '/students/directory',
    color: 'bg-blue-500',
  },
  {
    title: 'Admissions',
    description: 'Handle student admissions',
    icon: UserPlus,
    href: '/students/admissions',
    color: 'bg-green-500',
  },
  {
    title: 'Attendance',
    description: 'Track student attendance',
    icon: ClipboardList,
    href: '/students/attendance',
    color: 'bg-purple-500',
  },
  {
    title: 'Academic Records',
    description: 'Manage academic performance',
    icon: GraduationCap,
    href: '/students/academics',
    color: 'bg-yellow-500',
  },
  {
    title: 'Documents',
    description: 'Student documents and records',
    icon: FileText,
    href: '/students/documents',
    color: 'bg-pink-500',
  },
  {
    title: 'Courses',
    description: 'Course enrollment and tracking',
    icon: BookOpen,
    href: '/students/courses',
    color: 'bg-indigo-500',
  },
  {
    title: 'Behavior',
    description: 'Discipline and conduct records',
    icon: Activity,
    href: '/students/behavior',
    color: 'bg-red-500',
  },
  {
    title: 'Schedule',
    description: 'Class schedules and timetables',
    icon: Calendar,
    href: '/students/schedule',
    color: 'bg-orange-500',
  },
]

export default function StudentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <p className="text-gray-500">
          Manage students, admissions, and academic records
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {studentModules.map((module) => (
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
              <p className="text-sm text-gray-500">Total Students</p>
              <h4 className="text-2xl font-bold">1,234</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Admissions</p>
              <h4 className="text-2xl font-bold">45</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <ClipboardList className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Attendance</p>
              <h4 className="text-2xl font-bold">92%</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average GPA</p>
              <h4 className="text-2xl font-bold">3.5</h4>
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
                type: 'admission',
                name: 'John Smith',
                class: 'Class 10',
                date: '2024-01-15',
              },
              {
                type: 'attendance',
                name: 'Sarah Johnson',
                status: 'absent',
                date: '2024-01-14',
              },
              {
                type: 'academic',
                name: 'Mike Wilson',
                event: 'Exam Results Published',
                date: '2024-01-13',
              },
              {
                type: 'behavior',
                name: 'Emily Brown',
                event: 'Achievement Award',
                date: '2024-01-12',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center space-x-3">
                  {activity.type === 'admission' && (
                    <div className="bg-green-100 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {activity.type === 'attendance' && (
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <ClipboardList className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                  {activity.type === 'academic' && (
                    <div className="bg-blue-100 p-2 rounded-full">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'behavior' && (
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-500">
                      {activity.type === 'admission' && (
                        <>New admission to {activity.class}</>
                      )}
                      {activity.type === 'attendance' && (
                        <>Marked {activity.status}</>
                      )}
                      {activity.type === 'academic' && (
                        <>{activity.event}</>
                      )}
                      {activity.type === 'behavior' && (
                        <>{activity.event}</>
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
