import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'magnetic inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-[0.08em] uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brass text-charcoal shadow-brass hover:bg-amber-soft',
        secondary: 'border border-stone/25 bg-stone/8 text-stone hover:bg-stone/14',
        ghost: 'text-stone hover:text-amber-soft'
      },
      size: {
        sm: 'h-10 px-5',
        md: 'h-12 px-7',
        lg: 'h-14 px-9'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export function StudioCard({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('studio-card rounded-card border border-stone/12 bg-card-gradient p-5 shadow-soft backdrop-blur-sm', className)}>{children}</div>;
}

export function SectionEyebrow({ children }: React.PropsWithChildren) {
  return <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-sage">{children}</p>;
}

export function SectionTitle({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <h2 className={cn('reveal-title font-serif text-4xl leading-[0.98] text-stone md:text-6xl', className)}>{children}</h2>;
}
