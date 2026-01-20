import { renderHook, waitFor, act } from '@testing-library/react'
import { useAdminAuth } from '@/app/hooks/useAdminAuth'

// Mock fetch
global.fetch = jest.fn()

// Mock next/navigation
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

// Mock document.cookie with getter/setter
let cookieValue = ''
Object.defineProperty(document, 'cookie', {
  get: () => cookieValue,
  set: (val) => { cookieValue = val },
  configurable: true,
})

describe('useAdminAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
    cookieValue = ''
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  it('should set isAuthenticated to true when authenticated', async () => {
    cookieValue = 'admin_token=test-token'

    // Ensure fetch is properly mocked BEFORE rendering the hook
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ success: true, admin: { id: '1', email: 'admin@test.com' } }),
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAdminAuth())

    // Initial state
    expect(result.current.loading).toBe(true)
    expect(result.current.isAuthenticated).toBeNull()

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Wait for loading to be false
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    // Wait for isAuthenticated to be true
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    }, { timeout: 5000 })

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/auth', {
      method: 'GET',
      credentials: 'include',
    })
  }, 15000) // Increase test timeout to 15 seconds

  it('should set isAuthenticated to false when not authenticated', async () => {
    cookieValue = ''
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useAdminAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle fetch errors', async () => {
    cookieValue = 'admin_token=test-token'
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAdminAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should redirect to login when not authenticated', async () => {
    cookieValue = ''
    
    // Mock window.location.pathname
    delete (window as any).location
    ;(window as any).location = { pathname: '/admin/products' }

    renderHook(() => useAdminAuth())

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/login')
    }, { timeout: 3000 })
  })
})
