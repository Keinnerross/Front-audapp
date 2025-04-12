"use client";

import React from "react";
import Label from "../Label";

interface CustomProps {
  label: string;
  hint?: string;
  success?: boolean;
  error?: boolean;
  onImprove?: (text: string) => Promise<string>;
}

export type TextAreaInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & CustomProps;

export default function TextAreaInputAI({
  label,
  name,
  hint,
  success = false,
  error = false,
  className = "",
  onImprove,
  value = "",
  onChange,
  ...props
}: TextAreaInputProps) {
  const [isImproving, setIsImproving] = React.useState(false);

  const handleImprove = async () => {
    if (!onImprove || typeof value !== "string") return;
    setIsImproving(true);
    try {
      const improved = await onImprove(value);
      const syntheticEvent = {
        target: {
          name,
          value: improved,
        },
      } as unknown as React.ChangeEvent<HTMLTextAreaElement>;

      if (onChange) onChange(syntheticEvent);
    } catch (err) {
      console.error("❌ Error mejorando el texto:", err);
    }
    setIsImproving(false);
  };

  let textAreaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring resize-none min-h-[140px] dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (props.disabled) {
    textAreaClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textAreaClasses += ` text-error-800 border-error-500 focus:ring focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    textAreaClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
  } else {
    textAreaClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        {label && <Label htmlFor={name}>{label}</Label>}
        {onImprove && (
          <button
            type="button"
            disabled={isImproving}
            onClick={handleImprove}
            className="text-xs text-brand-500 hover:underline disabled:opacity-50"
          >
            {isImproving ? "Mejorando..." : "💡 Mejorar con IA"}
          </button>
        )}
      </div>

      <textarea
        id={name}
        name={name}
        className={textAreaClasses}
        value={value}
        onChange={onChange}
        {...props}
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
