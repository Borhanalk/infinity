import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/app/contexts/CartContext'
import { ReactNode } from 'react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      image: 'https://example.com/image.jpg',
    }

    act(() => {
      result.current.addItem({ ...product, quantity: 1 })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.count).toBe(1)
    expect(result.current.total).toBe(99.99)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      image: 'https://example.com/image.jpg',
    }

    act(() => {
      result.current.addItem({ ...product, quantity: 1 })
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.count).toBe(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      image: 'https://example.com/image.jpg',
    }

    act(() => {
      result.current.addItem({ ...product, quantity: 1 })
    })

    act(() => {
      result.current.updateQty('1', 3)
    })

    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.count).toBe(3)
    expect(result.current.total).toBe(99.99 * 3)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      image: 'https://example.com/image.jpg',
    }

    act(() => {
      result.current.addItem({ ...product, quantity: 1 })
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      result.current.clear()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.count).toBe(0)
  })

  it('should calculate total correctly with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product1 = {
      id: '1',
      name: 'Product 1',
      price: 50,
      image: 'https://example.com/image1.jpg',
    }

    const product2 = {
      id: '2',
      name: 'Product 2',
      price: 75,
      image: 'https://example.com/image2.jpg',
    }

    act(() => {
      result.current.addItem({ ...product1, quantity: 2 })
      result.current.addItem({ ...product2, quantity: 1 })
    })

    expect(result.current.count).toBe(3)
    expect(result.current.total).toBe(175) // (50 * 2) + (75 * 1)
  })
})
