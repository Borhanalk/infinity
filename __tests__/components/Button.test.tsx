import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByText('Disabled Button')).toBeDisabled()
  })

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    expect(screen.getByText('Link Button')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    // Check for actual CSS classes that are applied by the variant
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('should apply size classes', () => {
    const { container } = render(<Button size="lg">Large Button</Button>)
    // Check for actual CSS classes that are applied by the size
    expect(container.firstChild).toHaveClass('h-14')
  })
})
