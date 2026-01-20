import { GET } from '@/app/api/categories/route'
import { prisma } from '@/app/lib/prisma'

// Request is already polyfilled in jest.setup.js

// Mock Prisma
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

describe('GET /api/categories', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return categories successfully', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1', imageUrl: null, createdAt: new Date() },
      { id: 2, name: 'Category 2', imageUrl: null, createdAt: new Date() },
    ]

    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories)
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    // Dates are serialized to strings in JSON
    expect(data).toHaveLength(2)
    expect(data[0]).toMatchObject({ id: 1, name: 'Category 1', imageUrl: null })
    expect(data[1]).toMatchObject({ id: 2, name: 'Category 2', imageUrl: null })
    expect(data[0].createdAt).toBeDefined()
    expect(data[1].createdAt).toBeDefined()
    expect(prisma.category.findMany).toHaveBeenCalled()
  })

  it('should return empty array on error', async () => {
    ;(prisma.$connect as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })

  it('should order categories by id desc', async () => {
    ;(prisma.$connect as jest.Mock).mockResolvedValue(undefined)
    ;(prisma.category.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.$disconnect as jest.Mock).mockResolvedValue(undefined)

    await GET()

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'desc' },
    })
  })
})
