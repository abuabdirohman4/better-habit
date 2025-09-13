"use client";

import { forwardRef, ReactNode } from "react";

interface InputProps {
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
    name?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    helperClassName?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    min?: number;
    max?: number;
    step?: number;
    autoComplete?: string;
    autoFocus?: boolean;
    id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = "text",
            name,
            value,
            onChange,
            onBlur,
            onFocus,
            placeholder,
            label,
            error,
            helperText,
            disabled = false,
            required = false,
            className = "",
            inputClassName = "",
            labelClassName = "",
            errorClassName = "",
            helperClassName = "",
            leftIcon,
            rightIcon,
            min,
            max,
            step,
            autoComplete,
            autoFocus = false,
            id,
        },
        ref
    ) => {
        const inputId = id || name;

        const getInputClasses = () => {
            const baseClasses = "w-full px-4 py-3 text-gray-900 text-sm rounded-lg border-2 focus:ring-2 focus:ring-habit-blue focus:border-habit-blue transition-all duration-200";
            const errorClasses = error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-gray-300";
            const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white";
            const iconClasses = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";
            
            return `${baseClasses} ${errorClasses} ${disabledClasses} ${iconClasses} ${inputClassName}`;
        };

        const getLabelClasses = () => {
            const baseClasses = "block text-sm font-medium text-gray-700 mb-2";
            const errorClasses = error ? "text-red-600" : "";
            return `${baseClasses} ${errorClasses} ${labelClassName}`;
        };

        return (
            <div className={`space-y-1 ${className}`}>
                {/* Label */}
                {label && (
                    <label htmlFor={inputId} className={getLabelClasses()}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div className="text-gray-400">{leftIcon}</div>
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        ref={ref}
                        type={type}
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        min={min}
                        max={max}
                        step={step}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        className={getInputClasses()}
                    />

                    {/* Right Icon */}
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <div className="text-gray-400">{rightIcon}</div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className={`text-sm text-red-600 ${errorClassName}`}>
                        {error}
                    </p>
                )}

                {/* Helper Text */}
                {helperText && !error && (
                    <p className={`text-sm text-gray-500 ${helperClassName}`}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
