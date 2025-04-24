import React, { useRef } from "react";

interface CustomProps {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & CustomProps;

const Input: React.FC<InputProps> = ({
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  type,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleWrapperClick = () => {
    if (type === "date" && inputRef.current) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const safariVersionMatch = navigator.userAgent.match(/Version\/(\d+)/);
      const safariVersion = safariVersionMatch ? parseInt(safariVersionMatch[1]) : null;

      const isOldSafari = isSafari && safariVersion && safariVersion < 15;

      if (!isOldSafari && typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker(); // ✅ solo si es seguro
      }

      inputRef.current.focus();
    }
  };

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative" onClick={handleWrapperClick}>
      <input
        ref={inputRef}
        type={type}
        onChange={onChange}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e)} // fallback para Safari
        {...props}
        className={inputClasses}
        disabled={disabled}
      />
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
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
};

export default Input;
