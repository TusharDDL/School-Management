'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  Library,
  PenTool,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'

const academicModules = [
  {
    title: 'Curriculum',
    description: 'Manage and organize course curriculum',
    icon: BookOpen,
    href: '/academic/curriculum',
    color: 'bg-blue-500',
  },
  {
    title: 'Lesson Plans',
    description: 'Create and track lesson plans',
    icon: FileText,
    href: '/academic/lessons',
    color: 'bg-green-500',
  },
  {
    title: 'Assignments',
    description: 'Manage homework and assignments',
    icon: PenTool,
    href: '/academic/assignments',
    color: 'bg-purple-500',
  },
  {
    title: 'Examinations',
    description: 'Conduct and manage examinations',
    icon: ClipboardList,
    href: '/academic/exams',
    color: 'bg-red-500',
  },
  {
    title: 'Grade Book',
    description: 'Record and manage student grades',
    icon: GraduationCap,
    href: '/academic/gradebook',
    color: 'bg-yellow-500',
  },
  {
    title: 'Calendar',
    description: 'Academic calendar and events',
    icon: Calendar,
    href: '/academic/calendar',
    color: 'bg-pink-500',
  },
  {
    title: 'Resources',
    description: 'Educational resources and materials',
    icon: Library,
    href: '/academic/resources',
    color: 'bg-indigo-500',
  },
]

export default function AcademicPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Academic Management</h1>
        <p className="text-gray-500">
          Manage curriculum, lessons, assignments, and more
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicModules.map((module) => (
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

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Create Lesson Plan</Button>
          <Button variant="outline">Add Assignment</Button>
          <Button variant="outline">Schedule Exam</Button>
          <Button variant="outline">View Calendar</Button>
        </div>
      </div>
    </div>
  )
}
