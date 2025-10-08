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
  DialogAction,
} from "@/components/ui/base-dialog";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export interface CustomDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showDismissButton?: boolean;
  showBackdrop?: boolean;
  fullscreen?: boolean;
  className?: string;
}

export function CustomDialog({
  trigger,
  children,
  open,
  onOpenChange,
  showDismissButton = true,
  showBackdrop = true,
  fullscreen = false,
  className,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        showDismissButton={showDismissButton}
        showBackdrop={showBackdrop}
        fullscreen={fullscreen}
        className={className}
      >
        {children}
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
  showDismissButton?: boolean;
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
  showDismissButton = true,
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
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        showDismissButton={showDismissButton}
        className={cn(sizeClasses[size], className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
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
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent showDismissButton={false} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose onClick={handleCancel} disabled={loading}>
            {cancelText}
          </DialogClose>
          <DialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              variant === "danger" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              variant === "warning" &&
                "bg-orange-500 text-white hover:bg-orange-600",
              variant === "default" &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
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
          </DialogAction>
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
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
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
            <DialogClose
              type="button"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </DialogClose>
            <DialogAction
              type="submit"
              disabled={loading || disabled}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Loading..." : submitText}
            </DialogAction>
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
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("max-w-md", variantStyles[variant])}
        showDismissButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="py-4">{children}</div>}
        <DialogFooter>
          <DialogAction
            onClick={handleClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
          >
            {closeText}
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
