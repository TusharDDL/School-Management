import axiosInstance from '@/lib/axios'

export interface StudentPerformanceReport {
  student_id: number
  student_name: string
  class_name: string
  section_name: string
  subjects: {
    subject_name: string
    assessments: {
      name: string
      marks_obtained: number
      total_marks: number
      percentage: number
    }[]
    average_percentage: number
  }[]
  overall_average: number
}

export interface AttendanceReport {
  student_id: number
  student_name: string
  class_name: string
  section_name: string
  total_days: number
  present_days: number
  absent_days: number
  attendance_percentage: number
  monthly_breakdown: {
    month: string
    total_days: number
    present_days: number
    absent_days: number
    percentage: number
  }[]
}

export interface FeeReport {
  student_id: number
  student_name: string
  class_name: string
  section_name: string
  total_fees: number
  paid_amount: number
  pending_amount: number
  payment_history: {
    date: string
    amount: number
    payment_mode: string
    transaction_id: string
    status: string
  }[]
}

export interface ClassReport {
  class_id: number
  class_name: string
  sections: {
    section_id: number
    section_name: string
    total_students: number
    average_attendance: number
    average_performance: number
  }[]
  total_students: number
  average_attendance: number
  average_performance: number
}

const reportsService = {
  // Student Performance Reports
  async getStudentPerformance(params?: {
    student_id?: number
    class_id?: number
    section_id?: number
    subject_id?: number
    from_date?: string
    to_date?: string
  }) {
    const response = await axiosInstance.get('/api/reports/student-performance/', {
      params,
    })
    return response.data
  },

  async exportStudentPerformance(params?: {
    student_id?: number
    class_id?: number
    section_id?: number
    subject_id?: number
    from_date?: string
    to_date?: string
    format: 'pdf' | 'excel'
  }) {
    const response = await axiosInstance.get('/api/reports/student-performance/export/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Attendance Reports
  async getAttendanceReport(params?: {
    student_id?: number
    class_id?: number
    section_id?: number
    from_date?: string
    to_date?: string
  }) {
    const response = await axiosInstance.get('/api/reports/attendance/', {
      params,
    })
    return response.data
  },

  async exportAttendanceReport(params?: {
    student_id?: number
    class_id?: number
    section_id?: number
    from_date?: string
    to_date?: string
    format: 'pdf' | 'excel'
  }) {
    const response = await axiosInstance.get('/api/reports/attendance/export/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Fee Reports
  async getFeeReport(params?: {
    student_id?: number
    class_id?: number
    section_id?: number
    from_date?: string
    to_date?: string
    payment_status?: 'paid' | 'pending' | 'overdue'
  }) {
    const response = await axiosInstance.get('/api/reports/fees/', {
      params,
    })
    return response.data
  },

  async exportFeeReport(params?: {
    student_id?: number
    class_id?: number
    section_id?: number
    from_date?: string
    to_date?: string
    payment_status?: 'paid' | 'pending' | 'overdue'
    format: 'pdf' | 'excel'
  }) {
    const response = await axiosInstance.get('/api/reports/fees/export/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Class Reports
  async getClassReport(params?: {
    class_id?: number
    section_id?: number
    from_date?: string
    to_date?: string
  }) {
    const response = await axiosInstance.get('/api/reports/class/', {
      params,
    })
    return response.data
  },

  async exportClassReport(params?: {
    class_id?: number
    section_id?: number
    from_date?: string
    to_date?: string
    format: 'pdf' | 'excel'
  }) {
    const response = await axiosInstance.get('/api/reports/class/export/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Helper function to download exported files
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}

export default reportsService