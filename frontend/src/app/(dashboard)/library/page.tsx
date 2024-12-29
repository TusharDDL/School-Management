'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  BookCopy,
  Library,
  Clock,
  Settings,
  BarChart2,
  Search,
} from 'lucide-react'
import Link from 'next/link'

const libraryModules = [
  {
    title: 'Book Catalog',
    description: 'Manage books and resources',
    icon: BookOpen,
    href: '/library/catalog',
    color: 'bg-blue-500',
  },
  {
    title: 'Circulation',
    description: 'Issue and return books',
    icon: BookCopy,
    href: '/library/circulation',
    color: 'bg-green-500',
  },
  {
    title: 'Members',
    description: 'Manage library members',
    icon: Users,
    href: '/library/members',
    color: 'bg-purple-500',
  },
  {
    title: 'Due Books',
    description: 'Track overdue books',
    icon: Clock,
    href: '/library/due',
    color: 'bg-yellow-500',
  },
  {
    title: 'Categories',
    description: 'Book categories and genres',
    icon: Library,
    href: '/library/categories',
    color: 'bg-pink-500',
  },
  {
    title: 'Reports',
    description: 'Library analytics and reports',
    icon: BarChart2,
    href: '/library/reports',
    color: 'bg-indigo-500',
  },
  {
    title: 'Search',
    description: 'Advanced book search',
    icon: Search,
    href: '/library/search',
    color: 'bg-red-500',
  },
  {
    title: 'Settings',
    description: 'Library configuration',
    icon: Settings,
    href: '/library/settings',
    color: 'bg-orange-500',
  },
]

export default function LibraryPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Library Management</h1>
        <p className="text-gray-500">
          Manage library resources and circulation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {libraryModules.map((module) => (
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
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Books</p>
              <h4 className="text-2xl font-bold">5,234</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Members</p>
              <h4 className="text-2xl font-bold">1,245</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <BookCopy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Books Issued</p>
              <h4 className="text-2xl font-bold">328</h4>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue Books</p>
              <h4 className="text-2xl font-bold">45</h4>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {[
              {
                type: 'issue',
                student: 'John Smith',
                book: 'Introduction to Physics',
                date: '2024-01-15',
              },
              {
                type: 'return',
                student: 'Sarah Johnson',
                book: 'World History',
                date: '2024-01-14',
              },
              {
                type: 'new',
                book: 'Advanced Mathematics Vol. 2',
                quantity: 5,
                date: '2024-01-13',
              },
              {
                type: 'overdue',
                student: 'Mike Wilson',
                book: 'English Literature',
                date: '2024-01-12',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center space-x-3">
                  {activity.type === 'issue' && (
                    <div className="bg-green-100 p-2 rounded-full">
                      <BookCopy className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {activity.type === 'return' && (
                    <div className="bg-blue-100 p-2 rounded-full">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'new' && (
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Library className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                  {activity.type === 'overdue' && (
                    <div className="bg-red-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {activity.type === 'issue' && (
                        <>
                          {activity.student} borrowed {activity.book}
                        </>
                      )}
                      {activity.type === 'return' && (
                        <>
                          {activity.student} returned {activity.book}
                        </>
                      )}
                      {activity.type === 'new' && (
                        <>
                          Added {activity.quantity} copies of{' '}
                          {activity.book}
                        </>
                      )}
                      {activity.type === 'overdue' && (
                        <>
                          {activity.book} is overdue by{' '}
                          {activity.student}
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Popular Books */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Most Popular Books
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Introduction to Physics',
                  author: 'Dr. Robert Smith',
                  issued: 45,
                  available: 3,
                },
                {
                  title: 'World History',
                  author: 'Sarah Williams',
                  issued: 38,
                  available: 2,
                },
                {
                  title: 'Advanced Mathematics',
                  author: 'Prof. James Wilson',
                  issued: 35,
                  available: 5,
                },
                {
                  title: 'English Literature',
                  author: 'Emily Brown',
                  issued: 32,
                  available: 4,
                },
              ].map((book, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-500">
                      by {book.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {book.issued} times issued
                    </p>
                    <p className="text-sm text-gray-500">
                      {book.available} copies available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Category Distribution
            </h2>
            <div className="space-y-4">
              {[
                {
                  category: 'Science & Technology',
                  books: 1245,
                  percentage: 25,
                },
                {
                  category: 'Literature',
                  books: 856,
                  percentage: 18,
                },
                {
                  category: 'Mathematics',
                  books: 745,
                  percentage: 15,
                },
                {
                  category: 'History',
                  books: 632,
                  percentage: 12,
                },
              ].map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.category}</span>
                    <span>{category.books} books</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
