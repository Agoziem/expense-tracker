"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ScrollArea } from "../ui/base-scroll-area";

export interface CustomDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCloseButton?: boolean;
  className?: string;
}

export function CustomDialog({
  trigger,
  children,
  open,
  onOpenChange,
  showCloseButton = true,
  className,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={showCloseButton} className={className}>
        <VisuallyHidden.Root>
          <DialogTitle>Dialog</DialogTitle>
        </VisuallyHidden.Root>
        <div className="grid gap-4 py-4">
          <ScrollArea className="max-h-[80vh] pe-3.5">{children}</ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Standard dialog with header, body, and footer
export interface StandardDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCloseButton?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function StandardDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCloseButton = true,
  className,
  size = "md",
}: StandardDialogProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(sizeClasses[size], className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="max-h-[80vh] pe-3.5  ">{children}</ScrollArea>
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

// Confirmation dialog
export interface ConfirmDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  open,
  onOpenChange,
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={false} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant={
              variant === "danger"
                ? "destructive"
                : variant === "warning"
                ? "primary"
                : "primary"
            }
            className={cn(
              variant === "warning" &&
                "bg-orange-500 text-white hover:bg-orange-600"
            )}
          >
            {loading ? (
              <>
                <Spinner />
                Loading...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Form dialog
export interface FormDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function FormDialog({
  trigger,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  open,
  onOpenChange,
  loading = false,
  disabled = false,
  size = "md",
}: FormDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(sizeClasses[size])}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">{children}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button type="submit" disabled={loading || disabled}>
              {loading ? "Loading..." : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Alert dialog (info only)
export interface AlertDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  closeText?: string;
  variant?: "info" | "success" | "warning" | "error";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AlertDialog({
  trigger,
  title,
  description,
  children,
  onClose,
  closeText = "OK",
  variant = "info",
  open,
  onOpenChange,
}: AlertDialogProps) {
  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  const variantStyles = {
    info: "border-blue-200",
    success: "border-green-200",
    warning: "border-orange-200",
    error: "border-red-200",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("max-w-md", variantStyles[variant])}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="py-4">{children}</div>}
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            {closeText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
