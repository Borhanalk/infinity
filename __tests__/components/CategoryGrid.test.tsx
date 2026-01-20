import { render, screen } from '@testing-library/react'
import { CategoryGrid } from '@/app/components/CategoryGrid'

// Mock fetch
global.fetch = jest.fn()

describe('CategoryGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    const { container } = render(<CategoryGrid />)
    // Component shows loading skeleton, check for the grid container
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })

  it('should render categories when loaded', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1', imageUrl: 'https://example.com/image1.jpg' },
      { id: 2, name: 'Category 2', imageUrl: 'https://example.com/image2.jpg' },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    })

    render(<CategoryGrid />)

    // Wait for categories to load
    await screen.findByText('Category 1')
    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.getByText('Category 2')).toBeInTheDocument()
  })

  it('should render sale category', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<CategoryGrid />)

    await screen.findByText('מבצעים')
    expect(screen.getByText('מבצעים')).toBeInTheDocument()
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<CategoryGrid />)

    // Should still render sale category even on error
    await screen.findByText('מבצעים')
  })
})
