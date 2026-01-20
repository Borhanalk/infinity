import { GET } from '@/app/api/products/route'
import { prisma } from '@/app/lib/prisma'

// Mock Prisma
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

// Request is already polyfilled in jest.setup.js

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return products successfully', async () => {
    const mockProducts = [
      {
        id: '1',
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
      },
    ]

    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    // Dates are serialized to strings in JSON
    expect(data).toHaveLength(1)
    expect(data[0]).toMatchObject({
      id: '1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
      categoryId: 1,
      companyId: 1,
      isNew: false,
      isOnSale: false,
    })
    expect(data[0].createdAt).toBeDefined()
    expect(data[0].images).toEqual([])
    expect(data[0].category).toEqual({ id: 1, name: 'Category' })
    expect(data[0].company).toEqual({ id: 1, name: 'Company' })
    expect(prisma.product.findMany).toHaveBeenCalled()
  })

  it('should filter by categoryId when provided', async () => {
    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products?categoryId=1')
    await GET(request)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: 1,
        }),
      })
    )
  })

  it('should filter by isNew when filter=new', async () => {
    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products?filter=new')
    await GET(request)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isNew: true,
        }),
      })
    )
  })

  it('should handle database connection errors gracefully', async () => {
    ;(prisma.$connect as jest.Mock).mockRejectedValue(new Error('Connection failed'))

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('error')
    expect(data).toHaveProperty('products')
    expect(data.products).toEqual([])
  })
})
