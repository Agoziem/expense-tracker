'use client';

import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverContentProps,
} from '@/components/ui/base-popover';
import { cn } from '@/lib/utils';

export interface CustomPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverContentProps['side'];
  align?: PopoverContentProps['align'];
  sideOffset?: PopoverContentProps['sideOffset'];
  alignOffset?: PopoverContentProps['alignOffset'];
  showArrow?: boolean;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function CustomPopover({
  trigger,
  children,
  open,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  showArrow = true,
  className,
  contentClassName,
  disabled = false,
}: CustomPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        showArrow={showArrow}
        className={cn('p-4', contentClassName)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}


