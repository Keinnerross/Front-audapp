"use client";

import React from "react";
import Label from "../Label";

interface CustomProps {
  label: string;
  hint?: string;
  success?: boolean;
  error?: boolean;
}

export type TextAreaInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & CustomProps;

export default function TextAreaInput({
  label,
  name,
  hint,
  success = false,
  error = false,
  className = "",
  ...props
}: TextAreaInputProps) {
  let textAreaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

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
    <div className="space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <textarea id={name} name={name} className={textAreaClasses} {...props} />
      {hint && (
        <p
          className={`mt-1.5 text-xs ${error
              ? "text-error-500"
              : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
