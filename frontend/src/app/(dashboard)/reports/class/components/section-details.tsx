'use client'

import { useState } from 'react'
import { ClassReport } from '@/services/reports'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'
import { SectionAnalysisDialog } from './section-analysis-dialog'

interface SectionDetailsProps {
  data: ClassReport['sections']
}

export function SectionDetails({ data }: SectionDetailsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState<ClassReport['sections'][0] | null>(
    null
  )

  const filteredData = data.filter((section) =>
    section.section_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPerformanceStatus = (percentage: number) => {
    if (percentage >= 90) {
      return (
        <Badge variant="default" className="bg-green-500">
          Excellent
        </Badge>
      )
    } else if (percentage >= 75) {
      return (
        <Badge variant="default" className="bg-blue-500">
          Good
        </Badge>
      )
    } else if (percentage >= 60) {
      return (
        <Badge variant="default" className="bg-yellow-500">
          Average
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          Poor
        </Badge>
      )
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Section Details</h2>
          <Input
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Total Students</TableHead>
                <TableHead>Average Attendance</TableHead>
                <TableHead>Average Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((section) => (
                <TableRow key={section.section_id}>
                  <TableCell className="font-medium">
                    {section.section_name}
                  </TableCell>
                  <TableCell>{section.total_students}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${section.average_attendance}%`,
                          }}
                        />
                      </div>
                      <span>{section.average_attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${section.average_performance}%`,
                          }}
                        />
                      </div>
                      <span>{section.average_performance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPerformanceStatus(section.average_performance)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setSelectedSection(section)}
                        >
                          View Detailed Analysis
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedSection && (
        <SectionAnalysisDialog
          section={selectedSection}
          onClose={() => setSelectedSection(null)}
        />
      )}
    </>
  )
}
