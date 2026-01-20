import { verifyAdminToken } from '@/app/lib/admin-auth'
import jwt from 'jsonwebtoken'
import { prisma } from '@/app/lib/prisma'

// Request is already polyfilled in jest.setup.js

// Mock dependencies
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    admin: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

describe('verifyAdminToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return admin when token is valid', async () => {
    const mockAdmin = { id: 'admin-1', email: 'admin@test.com' }
    const mockToken = 'valid-token'

    ;(jwt.verify as jest.Mock).mockReturnValue({ id: 'admin-1', email: 'admin@test.com' })
    ;(prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin)

    // Create a mock request with cookies using NextRequest
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      headers: {
        Cookie: `admin_token=${mockToken}`,
      },
    })

    const result = await verifyAdminToken(request)

    expect(result).toEqual(mockAdmin)
    expect(jwt.verify).toHaveBeenCalled()
    expect(prisma.admin.findUnique).toHaveBeenCalledWith({
      where: { id: 'admin-1' },
      select: { id: true, email: true },
    })
  })

  it('should return null when token is missing', async () => {
    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products')

    const result = await verifyAdminToken(request)

    expect(result).toBeNull()
    expect(jwt.verify).not.toHaveBeenCalled()
  })

  it('should return null when token is invalid', async () => {
    ;(jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      headers: {
        Cookie: 'admin_token=invalid-token',
      },
    })

    const result = await verifyAdminToken(request)

    expect(result).toBeNull()
  })

  it('should return null when admin not found', async () => {
    ;(jwt.verify as jest.Mock).mockReturnValue({ id: 'admin-1', email: 'admin@test.com' })
    ;(prisma.admin.findUnique as jest.Mock).mockResolvedValue(null)

    const { NextRequest } = require('next/server')
    const request = new NextRequest('http://localhost:3000/api/admin/products', {
      headers: {
        Cookie: 'admin_token=valid-token',
      },
    })

    const result = await verifyAdminToken(request)

    expect(result).toBeNull()
  })
})
