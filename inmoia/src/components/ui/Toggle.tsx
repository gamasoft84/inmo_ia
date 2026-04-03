"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export function Toggle({ checked, defaultChecked = false, onChange, label, disabled = false }: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const active = isControlled ? checked : internal;

  function toggle() {
    if (disabled) return;
    const next = !active;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <button type="button" onClick={toggle} className="inline-flex items-center gap-2" aria-pressed={active} disabled={disabled}>
      <span className={cn("toggle-track", active && "on")}> 
        <span className="toggle-knob" />
      </span>
      <span className="toggle-text">{active ? "Si" : "No"}</span>
      {label ? <span className="text-[11px] text-text-secondary">{label}</span> : null}
    </button>
  );
}
