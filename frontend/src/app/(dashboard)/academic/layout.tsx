'use client'

import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const academicLinks = [
  { href: '/academic', label: 'Overview' },
  { href: '/academic/classes', label: 'Classes & Sections' },
  { href: '/academic/subjects', label: 'Subjects' },
  { href: '/academic/attendance', label: 'Attendance' },
  { href: '/academic/assessments', label: 'Assessments' },
  { href: '/academic/assignments', label: 'Assignments' },
  { href: '/academic/timetable', label: 'Timetable' },
]

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <div className="flex flex-col space-y-6">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex space-x-4">
            {academicLinks.map((link) => {
              // Hide certain links based on user role
              if (
                user?.role === 'student' &&
                ['/academic/classes', '/academic/subjects'].includes(link.href)
              ) {
                return null
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href
                      ? 'text-black dark:text-white'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
