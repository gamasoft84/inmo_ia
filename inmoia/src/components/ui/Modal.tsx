"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="overlay-backdrop fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-text-primary">{title}</h3>
          <Button size="sm" variant="ghost" onClick={onClose} aria-label="Cerrar modal">
            <X size={14} />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
