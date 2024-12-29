import axiosInstance from '@/lib/axios'
import { User } from './auth'

export interface AcademicYear {
  id: number
  name: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface Class {
  id: number
  name: string
  description: string
  created_at: string
}

export interface Section {
  id: number
  name: string
  class_name: Class
  teacher: User
  academic_year: AcademicYear
  student_count: number
  created_at: string
}

export interface Subject {
  id: number
  name: string
  code: string
  description: string
  class_name: Class
  teacher: User
  created_at: string
}

export interface Attendance {
  id: number
  student: User
  section: Section
  date: string
  is_present: boolean
  remarks: string
  created_at: string
}

export interface Assessment {
  id: number
  name: string
  subject: Subject
  section: Section
  date: string
  total_marks: number
  created_at: string
}

export interface AssessmentResult {
  id: number
  assessment: Assessment
  student: User
  marks_obtained: number
  remarks: string
  created_at: string
}

export interface Assignment {
  id: number
  title: string
  description: string
  subject: Subject
  section: Section
  due_date: string
  file: string | null
  submission_count: number
  created_at: string
}

export interface AssignmentSubmission {
  id: number
  assignment: Assignment
  student: User
  file: string
  submitted_at: string
  remarks: string
  score: number | null
}

export interface Timetable {
  id: number
  section: Section
  subject: Subject
  weekday: number
  start_time: string
  end_time: string
  created_at: string
}

const academicService = {
  // Academic Year
  async getAcademicYears() {
    const response = await axiosInstance.get('/api/academic/academic-years/')
    return response.data
  },

  async createAcademicYear(data: Partial<AcademicYear>) {
    const response = await axiosInstance.post('/api/academic/academic-years/', data)
    return response.data
  },

  async updateAcademicYear(id: number, data: Partial<AcademicYear>) {
    const response = await axiosInstance.patch(`/api/academic/academic-years/${id}/`, data)
    return response.data
  },

  async deleteAcademicYear(id: number) {
    await axiosInstance.delete(`/api/academic/academic-years/${id}/`)
  },

  // Classes
  async getClasses() {
    const response = await axiosInstance.get('/api/academic/classes/')
    return response.data
  },

  async createClass(data: Partial<Class>) {
    const response = await axiosInstance.post('/api/academic/classes/', data)
    return response.data
  },

  async updateClass(id: number, data: Partial<Class>) {
    const response = await axiosInstance.patch(`/api/academic/classes/${id}/`, data)
    return response.data
  },

  async deleteClass(id: number) {
    await axiosInstance.delete(`/api/academic/classes/${id}/`)
  },

  // Sections
  async getSections() {
    const response = await axiosInstance.get('/api/academic/sections/')
    return response.data
  },

  async createSection(data: {
    name: string
    class_name_id: number
    teacher_id: number
    academic_year_id: number
  }) {
    const response = await axiosInstance.post('/api/academic/sections/', data)
    return response.data
  },

  async updateSection(id: number, data: Partial<Section>) {
    const response = await axiosInstance.patch(`/api/academic/sections/${id}/`, data)
    return response.data
  },

  async deleteSection(id: number) {
    await axiosInstance.delete(`/api/academic/sections/${id}/`)
  },

  async addStudentsToSection(sectionId: number, studentIds: number[]) {
    const response = await axiosInstance.post(
      `/api/academic/sections/${sectionId}/add_students/`,
      { student_ids: studentIds }
    )
    return response.data
  },

  async removeStudentsFromSection(sectionId: number, studentIds: number[]) {
    const response = await axiosInstance.post(
      `/api/academic/sections/${sectionId}/remove_students/`,
      { student_ids: studentIds }
    )
    return response.data
  },

  // Subjects
  async getSubjects() {
    const response = await axiosInstance.get('/api/academic/subjects/')
    return response.data
  },

  async createSubject(data: {
    name: string
    code: string
    description?: string
    class_name_id: number
    teacher_id: number
  }) {
    const response = await axiosInstance.post('/api/academic/subjects/', data)
    return response.data
  },

  async updateSubject(id: number, data: Partial<Subject>) {
    const response = await axiosInstance.patch(`/api/academic/subjects/${id}/`, data)
    return response.data
  },

  async deleteSubject(id: number) {
    await axiosInstance.delete(`/api/academic/subjects/${id}/`)
  },

  // Attendance
  async getAttendance(params?: { section?: number; date?: string }) {
    const response = await axiosInstance.get('/api/academic/attendance/', { params })
    return response.data
  },

  async markAttendance(data: {
    student_id: number
    section_id: number
    date: string
    is_present: boolean
    remarks?: string
  }[]) {
    const response = await axiosInstance.post('/api/academic/attendance/bulk_create/', data)
    return response.data
  },

  // Assessments
  async getAssessments() {
    const response = await axiosInstance.get('/api/academic/assessments/')
    return response.data
  },

  async createAssessment(data: {
    name: string
    subject_id: number
    section_id: number
    date: string
    total_marks: number
  }) {
    const response = await axiosInstance.post('/api/academic/assessments/', data)
    return response.data
  },

  async updateAssessment(id: number, data: Partial<Assessment>) {
    const response = await axiosInstance.patch(`/api/academic/assessments/${id}/`, data)
    return response.data
  },

  async deleteAssessment(id: number) {
    await axiosInstance.delete(`/api/academic/assessments/${id}/`)
  },

  // Assessment Results
  async getAssessmentResults(assessmentId: number) {
    const response = await axiosInstance.get('/api/academic/assessment-results/', {
      params: { assessment: assessmentId }
    })
    return response.data
  },

  async submitAssessmentResults(data: {
    assessment_id: number
    student_id: number
    marks_obtained: number
    remarks?: string
  }[]) {
    const response = await axiosInstance.post('/api/academic/assessment-results/bulk_create/', data)
    return response.data
  },

  // Assignments
  async getAssignments() {
    const response = await axiosInstance.get('/api/academic/assignments/')
    return response.data
  },

  async createAssignment(data: FormData) {
    const response = await axiosInstance.post('/api/academic/assignments/', data)
    return response.data
  },

  async updateAssignment(id: number, data: FormData) {
    const response = await axiosInstance.patch(`/api/academic/assignments/${id}/`, data)
    return response.data
  },

  async deleteAssignment(id: number) {
    await axiosInstance.delete(`/api/academic/assignments/${id}/`)
  },

  // Assignment Submissions
  async getAssignmentSubmissions(assignmentId: number) {
    const response = await axiosInstance.get('/api/academic/assignment-submissions/', {
      params: { assignment: assignmentId }
    })
    return response.data
  },

  async submitAssignment(data: FormData) {
    const response = await axiosInstance.post('/api/academic/assignment-submissions/', data)
    return response.data
  },

  async gradeAssignment(id: number, data: { score: number; remarks?: string }) {
    const response = await axiosInstance.patch(`/api/academic/assignment-submissions/${id}/`, data)
    return response.data
  },

  // Timetable
  async getTimetable(sectionId?: number) {
    const response = await axiosInstance.get('/api/academic/timetable/', {
      params: { section: sectionId }
    })
    return response.data
  },

  async createTimetableEntry(data: {
    section_id: number
    subject_id: number
    weekday: number
    start_time: string
    end_time: string
  }) {
    const response = await axiosInstance.post('/api/academic/timetable/', data)
    return response.data
  },

  async updateTimetableEntry(id: number, data: Partial<Timetable>) {
    const response = await axiosInstance.patch(`/api/academic/timetable/${id}/`, data)
    return response.data
  },

  async deleteTimetableEntry(id: number) {
    await axiosInstance.delete(`/api/academic/timetable/${id}/`)
  }
}

export default academicService