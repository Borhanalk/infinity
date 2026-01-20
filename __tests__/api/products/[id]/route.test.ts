import { GET } from '@/app/api/products/[id]/route'
import { prisma } from '@/app/lib/prisma'

// Request is already polyfilled in jest.setup.js

// Mock Prisma
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

describe('GET /api/products/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return product when found', async () => {
    const mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
      categoryId: 1,
      companyId: 1,
      isNew: false,
      isOnSale: false,
      createdAt: new Date(),
      images: [],
      colors: [],
      sizes: [],
      category: { id: 1, name: 'Category' },
      company: { id: 1, name: 'Company' },
    }

    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct)
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const params = Promise.resolve({ id: 'product-1' })
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products/product-1')
    
    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    // Dates are serialized to strings in JSON
    expect(data).toMatchObject({
      id: 'product-1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
      categoryId: 1,
      companyId: 1,
      isNew: false,
      isOnSale: false,
    })
    expect(data.createdAt).toBeDefined()
    expect(data.images).toEqual([])
    expect(data.category).toEqual({ id: 1, name: 'Category' })
    expect(data.company).toEqual({ id: 1, name: 'Company' })
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: 'product-1' },
      include: expect.any(Object),
    })
  })

  it('should return 404 when product not found', async () => {
    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.product.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const params = Promise.resolve({ id: 'non-existent' })
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products/non-existent')
    
    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data).toHaveProperty('error')
  })

  it('should handle database errors', async () => {
    ;(prisma.$connect as jest.Mock).mockRejectedValue(new Error('Database error'))

    const params = Promise.resolve({ id: 'product-1' })
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products/product-1')
    
    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })
})
