"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  // ✅ Référence pour surveiller le dialog
  const contentRef = React.useRef<HTMLDivElement>(null);

  // ✅ Effet pour corriger aria-hidden après l'ouverture
  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state"
        ) {
          const target = mutation.target as HTMLElement;
          const state = target.getAttribute("data-state");

          if (state === "open") {
            // ✅ Supprimer aria-hidden quand le dialog est ouvert
            setTimeout(() => {
              target.removeAttribute("aria-hidden");
              target.removeAttribute("data-aria-hidden");
            }, 100);
          }
        }
      });
    });

    observer.observe(content, {
      attributes: true,
      attributeFilter: ["data-state", "aria-hidden"],
    });

    // ✅ Force la suppression d'aria-hidden si déjà ouvert
    if (content.getAttribute("data-state") === "open") {
      content.removeAttribute("aria-hidden");
      content.removeAttribute("data-aria-hidden");
    }

    return () => observer.disconnect();
  }, []);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={(node) => {
          // ✅ Combiner les refs
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          contentRef.current = node;
        }}
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        // ✅ Gérer le focus d'ouverture
        onOpenAutoFocus={(event) => {
          // Empêcher le focus automatique par défaut
          event.preventDefault();

          // Délai pour s'assurer que aria-hidden est supprimé
          setTimeout(() => {
            const content = event.currentTarget;
            if (content) {
              // Supprimer aria-hidden si encore présent
              content.removeAttribute("aria-hidden");
              content.removeAttribute("data-aria-hidden");

              // Trouver et focus le premier input
              const firstInput = content.querySelector(
                'input:not([disabled]):not([type="hidden"])'
              ) as HTMLElement;
              if (firstInput) {
                firstInput.focus();
              }
            }
          }, 150);
        }}
        // ✅ Gérer la fermeture
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        // ✅ Forcer l'absence d'aria-hidden
        aria-hidden={undefined}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get the dialog content element (parent)
    const dialogContent = (e.currentTarget as HTMLElement).closest('[data-slot="dialog-content"]') as HTMLElement;
    if (!dialogContent) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialTransform = dialogContent.style.transform || '';
    
    // Extract current position from transform
    const transformMatch = initialTransform.match(/translate\(calc\(-50% \+ (-?\d+)px\), calc\(-50% \+ (-?\d+)px\)\)/);
    const currentX = transformMatch ? parseInt(transformMatch[1]) : 0;
    const currentY = transformMatch ? parseInt(transformMatch[2]) : 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      dialogContent.style.transform = `translate(calc(-50% + ${currentX + deltaX}px), calc(-50% + ${currentY + deltaY}px))`;
      dialogContent.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      dialogContent.style.cursor = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={ref}
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left cursor-grab active:cursor-grabbing", className)}
      onMouseDown={handleMouseDown}
      {...props}
    />
  );
});
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn("text-lg leading-none font-semibold", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
