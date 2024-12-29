'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import academicService from '@/services/academic'
import { AssessmentList } from './components/assessment-list'
import { CreateAssessmentDialog } from './components/create-assessment-dialog'

export default function AssessmentsPage() {
  const { user } = useAuth()
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const { data: assessments } = useQuery({
    queryKey: ['assessments', selectedSection],
    queryFn: academicService.getAssessments,
    enabled: !!selectedSection,
  })

  const filteredAssessments = assessments?.filter(
    (assessment) =>
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        {user?.role === 'teacher' && selectedSection && (
          <CreateAssessmentDialog sectionId={parseInt(selectedSection)} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Section</h2>
            <Select
              value={selectedSection}
              onValueChange={setSelectedSection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a section" />
              </SelectTrigger>
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
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Search</h2>
            <Input
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Stats */}
          {selectedSection && assessments && (
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <h2 className="font-semibold text-lg">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Assessments</p>
                  <p className="text-2xl font-bold">{assessments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold">
                    {
                      assessments.filter(
                        (a) => new Date(a.date) > new Date()
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assessment List */}
        <div className="md:col-span-3">
          {selectedSection ? (
            filteredAssessments ? (
              <AssessmentList
                assessments={filteredAssessments}
                sectionId={parseInt(selectedSection)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Loading assessments...
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Please select a section to view assessments
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
