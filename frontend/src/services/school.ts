import axiosInstance from '@/lib/axios'

export interface SchoolRegistration {
  name: string
  address: string
  contact_email: string
  contact_phone: string
  board_affiliation: 'CBSE' | 'ICSE' | 'STATE'
  student_strength: number
  staff_count: number
  principal_name: string
  principal_email: string
  principal_phone: string
  academic_year_start: number
  academic_year_end: number
}

export interface School extends SchoolRegistration {
  id: number
  is_approved: boolean
  approval_date: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

const schoolService = {
  async register(data: SchoolRegistration): Promise<School> {
    const response = await axiosInstance.post('/api/core/schools/', data)
    return response.data
  },

  async getSchoolStatus(): Promise<School> {
    const response = await axiosInstance.get('/api/core/schools/status/')
    return response.data
  },

  // Admin endpoints
  async getAllSchools(): Promise<School[]> {
    const response = await axiosInstance.get('/api/core/schools/')
    return response.data
  },

  async approveSchool(id: number): Promise<School> {
    const response = await axiosInstance.post(`/api/core/schools/${id}/approve/`)
    return response.data
  },

  async rejectSchool(id: number, reason: string): Promise<School> {
    const response = await axiosInstance.post(`/api/core/schools/${id}/reject/`, {
      reason,
    })
    return response.data
  },

  async updateSchool(id: number, data: Partial<SchoolRegistration>): Promise<School> {
    const response = await axiosInstance.patch(`/api/core/schools/${id}/`, data)
    return response.data
  },
}

export default schoolService
