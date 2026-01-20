import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/app/components/ProductCard'

const mockProduct = {
  id: 'test-id-123',
  name: 'Test Product',
  price: 99.99,
  description: 'Test description',
  isNew: false,
  isOnSale: false,
  categoryId: 1,
  category: {
    id: 1,
    name: 'Test Category',
  },
  company: {
    id: 1,
    name: 'Test Company',
    logoUrl: null,
  },
  images: [
    {
      id: 'img-1',
      url: 'https://example.com/image.jpg',
    },
  ],
  colors: [],
  sizes: [],
}

describe('ProductCard', () => {
  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('should render product price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('99.99 ₪')).toBeInTheDocument()
  })

  it('should render product without name as "منتج"', () => {
    const productWithoutName = { ...mockProduct, name: '' }
    render(<ProductCard product={productWithoutName} />)
    expect(screen.getByText('منتج')).toBeInTheDocument()
  })

  it('should render NEW badge when isNew is true', () => {
    const newProduct = { ...mockProduct, isNew: true }
    render(<ProductCard product={newProduct} />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('should render SALE badge when isOnSale is true', () => {
    const saleProduct = { ...mockProduct, isOnSale: true }
    render(<ProductCard product={saleProduct} />)
    expect(screen.getByText('SALE')).toBeInTheDocument()
  })

  it('should render original price when on sale', () => {
    const saleProduct = {
      ...mockProduct,
      isOnSale: true,
      originalPrice: 149.99,
      price: 99.99,
    }
    render(<ProductCard product={saleProduct} />)
    expect(screen.getByText('149.99 ₪')).toBeInTheDocument()
  })

  it('should render category name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('should render company name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Company')).toBeInTheDocument()
  })
})
