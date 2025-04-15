import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof ShadcnButton> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <ShadcnButton
      className={cn(className)}
      variant={variant}
      size={size}
      asChild={asChild}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
} 