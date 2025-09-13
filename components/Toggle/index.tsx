"use client";

import { forwardRef } from "react";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    helperText?: string;
    error?: string;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "success" | "warning" | "error";
    className?: string;
    labelClassName?: string;
    errorClassName?: string;
    helperClassName?: string;
    id?: string;
    name?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    (
        {
            checked,
            onChange,
            onBlur,
            onFocus,
            disabled = false,
            required = false,
            label,
            helperText,
            error,
            size = "md",
            color = "primary",
            className = "",
            labelClassName = "",
            errorClassName = "",
            helperClassName = "",
            id,
            name,
        },
        ref
    ) => {
        const toggleId = id || name;

        const getSizeClasses = () => {
            switch (size) {
                case "sm":
                    return "w-8 h-4";
                case "md":
                    return "w-11 h-6";
                case "lg":
                    return "w-14 h-7";
                default:
                    return "w-11 h-6";
            }
        };

        const getThumbSizeClasses = () => {
            switch (size) {
                case "sm":
                    return "h-3 w-3";
                case "md":
                    return "h-5 w-5";
                case "lg":
                    return "h-6 w-6";
                default:
                    return "h-5 w-5";
            }
        };

        const getColorClasses = () => {
            switch (color) {
                case "primary":
                    return "bg-habit-blue";
                case "success":
                    return "bg-habit-green";
                case "warning":
                    return "bg-habit-yellow";
                case "error":
                    return "bg-habit-red";
                default:
                    return "bg-habit-blue";
            }
        };

        const getLabelClasses = () => {
            const baseClasses = "text-sm font-medium text-gray-700";
            const errorClasses = error ? "text-red-600" : "";
            const disabledClasses = disabled ? "text-gray-400" : "";
            return `${baseClasses} ${errorClasses} ${disabledClasses} ${labelClassName}`;
        };

        return (
            <div className={`space-y-1 ${className}`}>
                {/* Label */}
                {label && (
                    <label htmlFor={toggleId} className={getLabelClasses()}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Toggle Switch */}
                <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            ref={ref}
                            type="checkbox"
                            id={toggleId}
                            name={name}
                            checked={checked}
                            onChange={(e) => onChange(e.target.checked)}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            disabled={disabled}
                            required={required}
                            className="sr-only peer"
                        />
                        <div
                            className={`${getSizeClasses()} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-habit-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:${getColorClasses()} ${
                                disabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <div
                                className={`${getThumbSizeClasses()} transform rounded-full bg-white transition-transform ${
                                    checked ? "translate-x-full" : "translate-x-0"
                                }`}
                            />
                        </div>
                    </label>
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

Toggle.displayName = "Toggle";

export default Toggle;
