import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
        outline:
          "border-2 border-[#D4AF37]/40 bg-background hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] text-foreground shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-[#D4AF37] underline-offset-4 hover:underline hover:text-[#C9A961]",
        gold: "bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-black hover:from-[#C9A961] hover:to-[#D4AF37] font-bold shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm sm:text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-8 text-base sm:text-lg",
        xl: "h-15 px-10 text-lg sm:text-xl",
        icon: "h-11 w-11 sm:h-12 sm:w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
