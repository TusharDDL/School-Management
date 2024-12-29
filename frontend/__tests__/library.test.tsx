import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BookCatalog } from '@/components/library/BookCatalog'
import { BookCirculation } from '@/components/library/BookCirculation'

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

describe('BookCatalog', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders book catalog', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: 'Test Book',
            author: 'Test Author',
            isbn: '1234567890',
            available_copies: 5,
          },
        ]),
    })

    render(<BookCatalog />)

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
      expect(screen.getByText('Test Author')).toBeInTheDocument()
    })
  })

  it('handles book search', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: 'Physics Book',
            author: 'Physics Author',
            isbn: '1234567890',
            available_copies: 5,
          },
        ]),
    })

    render(<BookCatalog />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'physics' } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=physics'),
        expect.any(Object)
      )
      expect(screen.getByText('Physics Book')).toBeInTheDocument()
    })
  })
})

describe('BookCirculation', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders circulation records', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            book: {
              title: 'Test Book',
              author: 'Test Author',
            },
            member: {
              user: {
                first_name: 'John',
                last_name: 'Smith',
              },
            },
            issue_date: '2024-01-15',
            due_date: '2024-01-29',
            status: 'issued',
          },
        ]),
    })

    render(<BookCirculation />)

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
      expect(screen.getByText('John Smith')).toBeInTheDocument()
    })
  })

  it('handles book return', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              book: {
                title: 'Test Book',
                author: 'Test Author',
              },
              member: {
                user: {
                  first_name: 'John',
                  last_name: 'Smith',
                },
              },
              issue_date: '2024-01-15',
              due_date: '2024-01-29',
              status: 'issued',
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            status: 'returned',
            return_date: '2024-01-20',
          }),
      })

    render(<BookCirculation />)

    await waitFor(() => {
      const returnButton = screen.getByRole('button', { name: /return/i })
      fireEvent.click(returnButton)
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/return'),
        expect.any(Object)
      )
    })
  })
})
