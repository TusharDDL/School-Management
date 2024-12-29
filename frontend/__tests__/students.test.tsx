import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StudentList } from '@/components/students/StudentList'
import { StudentForm } from '@/components/students/StudentForm'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

// Mock API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('StudentList', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders student list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            admission_number: '2024001',
            class_name: 'Class 10',
            section: 'A',
          },
        ]),
    })

    render(<StudentList />)

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('2024001')).toBeInTheDocument()
      expect(screen.getByText('Class 10 - A')).toBeInTheDocument()
    })
  })

  it('filters students by class and section', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            admission_number: '2024001',
            class_name: 'Class 10',
            section: 'A',
          },
        ]),
    })

    render(<StudentList />)

    const classSelect = screen.getByLabelText(/class/i)
    const sectionSelect = screen.getByLabelText(/section/i)

    fireEvent.change(classSelect, { target: { value: 'Class 10' } })
    fireEvent.change(sectionSelect, { target: { value: 'A' } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('class/Class 10/section/A'),
        expect.any(Object)
      )
    })
  })
})

describe('StudentForm', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders student form', () => {
    render(<StudentForm />)

    expect(screen.getByLabelText(/admission number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/roll number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/class/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/section/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/parent name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/parent phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/parent email/i)).toBeInTheDocument()
  })

  it('handles student creation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          admission_number: '2024001',
          first_name: 'John',
          last_name: 'Smith',
        }),
    })

    render(<StudentForm />)

    fireEvent.change(screen.getByLabelText(/admission number/i), {
      target: { value: '2024001' },
    })
    fireEvent.change(screen.getByLabelText(/roll number/i), {
      target: { value: '101' },
    })
    fireEvent.change(screen.getByLabelText(/class/i), {
      target: { value: 'Class 10' },
    })
    fireEvent.change(screen.getByLabelText(/section/i), {
      target: { value: 'A' },
    })
    fireEvent.change(screen.getByLabelText(/parent name/i), {
      target: { value: 'Parent Name' },
    })
    fireEvent.change(screen.getByLabelText(/parent phone/i), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText(/parent email/i), {
      target: { value: 'parent@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/students',
        expect.any(Object)
      )
    })
  })

  it('handles validation errors', async () => {
    render(<StudentForm />)

    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText(/admission number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/roll number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/class is required/i)).toBeInTheDocument()
      expect(screen.getByText(/section is required/i)).toBeInTheDocument()
    })
  })
})
