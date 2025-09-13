"use client";

import { useEffect, useRef, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
    className?: string;
    closeOnBackdrop?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
    className = "",
    closeOnBackdrop = true,
}) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (closeOnBackdrop && e.target === modalRef.current) {
            onClose();
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "max-w-md";
            case "md":
                return "max-w-lg";
            case "lg":
                return "max-w-2xl";
            case "xl":
                return "max-w-4xl";
            default:
                return "max-w-lg";
        }
    };

    if (!isOpen) return null;

    return (
        <dialog
            ref={modalRef}
            className="modal backdrop-blur-sm backdrop-brightness-50"
            onClick={handleBackdropClick}
        >
            <div className={`modal-box ${getSizeClasses()} ${className}`}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between mb-4">
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-800">
                                {title}
                            </h3>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                <FontAwesomeIcon icon={faXmark} size="sm" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </dialog>
    );
};

export default Modal;
