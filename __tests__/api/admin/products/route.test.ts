import { POST } from '@/app/api/admin/products/route'
import { prisma } from '@/app/lib/prisma'
import { verifyAdminToken } from '@/app/lib/admin-auth'

// Request is already polyfilled in jest.setup.js

// Mock dependencies
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    product: {
      create: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

jest.mock('@/app/lib/admin-auth', () => ({
  verifyAdminToken: jest.fn(),
}))

describe('POST /api/admin/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(verifyAdminToken as jest.Mock).mockResolvedValue({ id: 'admin-1', email: 'admin@test.com' })
  })

  it('should create product successfully', async () => {
    const mockCategory = { id: 1, name: 'Category' }
    const mockCompany = { id: 1, name: 'Company' }
    const mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
      categoryId: 1,
      companyId: 1,
      images: [],
      colors: [],
      sizes: [],
    }

    ;(prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory)
    ;(prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany)
    ;(prisma.product.create as jest.Mock).mockResolvedValue(mockProduct)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        price: 99.99,
        description: 'Test description',
        categoryId: 1,
        companyId: 1,
        images: ['https://example.com/image.jpg'],
        colors: [],
        sizes: [],
        isNew: false,
        isOnSale: false,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockProduct)
    expect(prisma.product.create).toHaveBeenCalled()
  })

  it('should return 401 if not authenticated', async () => {
    ;(verifyAdminToken as jest.Mock).mockResolvedValue(null)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toHaveProperty('error')
  })

  it('should allow product without name (name is optional)', async () => {
    const mockCategory = { id: 1, name: 'Category' }
    const mockCompany = { id: 1, name: 'Company' }
    const mockProduct = {
      id: '1',
      name: '',
      price: 99.99,
      description: 'Test',
      categoryId: 1,
      companyId: 1,
      images: [],
      colors: [],
      sizes: [],
    }

    ;(verifyAdminToken as jest.Mock).mockResolvedValue({ id: '1', email: 'admin@test.com' })
    ;(prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory)
    ;(prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany)
    ;(prisma.product.create as jest.Mock).mockResolvedValue(mockProduct)
    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: 99.99,
        description: 'Test',
        categoryId: 1,
        companyId: 1,
        images: ['https://example.com/image.jpg'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    // Name is optional, so this should succeed
    expect(response.status).toBe(200)
    expect(data).toMatchObject({
      id: '1',
      price: 99.99,
      categoryId: 1,
      companyId: 1,
    })
  })

  it('should return 400 if price is invalid', async () => {
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        price: -10,
        description: 'Test',
        categoryId: 1,
        companyId: 1,
        images: ['https://example.com/image.jpg'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return 400 if category not found', async () => {
    ;(prisma.category.findUnique as jest.Mock).mockResolvedValue(null)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        price: 99.99,
        description: 'Test',
        categoryId: 999,
        companyId: 1,
        images: ['https://example.com/image.jpg'],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return 400 if no images provided', async () => {
    const mockCategory = { id: 1, name: 'Category' }
    const mockCompany = { id: 1, name: 'Company' }

    ;(prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory)
    ;(prisma.company.findUnique as jest.Mock).mockResolvedValue(mockCompany)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        price: 99.99,
        description: 'Test',
        categoryId: 1,
        companyId: 1,
        images: [],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })
})
