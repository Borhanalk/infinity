import { render, screen } from '@testing-library/react'
import { Navbar } from '@/app/components/Navbar'

// Mock useAuth
jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}))

// Mock useCart
jest.mock('@/app/contexts/CartContext', () => ({
  useCart: () => ({
    totalItems: 0,
  }),
}))

describe('Navbar Component', () => {
  it('should render navbar', () => {
    render(<Navbar />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render home link', () => {
    render(<Navbar />)
    expect(screen.getByText('בית')).toBeInTheDocument()
  })

  it('should render new collection link', () => {
    render(<Navbar />)
    expect(screen.getByText('חדש')).toBeInTheDocument()
  })

  it('should render sale link', () => {
    render(<Navbar />)
    expect(screen.getByText('מבצעים')).toBeInTheDocument()
  })

  it('should render logo', () => {
    render(<Navbar />)
    // Navbar uses text logo, not an image
    const logo = screen.getByText('הגבר האלגנטי')
    expect(logo).toBeInTheDocument()
  })
})
