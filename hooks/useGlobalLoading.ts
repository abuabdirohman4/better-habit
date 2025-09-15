"use client";

import { useState, useEffect } from "react";

// Global loading state management
let globalLoadingState = {
    isLoading: false,
    listeners: new Set<(loading: boolean) => void>()
};

export const useGlobalLoading = () => {
    const [isLoading, setIsLoading] = useState(globalLoadingState.isLoading);

    useEffect(() => {
        const listener = (loading: boolean) => setIsLoading(loading);
        globalLoadingState.listeners.add(listener);
        
        return () => {
            globalLoadingState.listeners.delete(listener);
        };
    }, []);

    return { isLoading };
};

// Hook untuk set loading state dari komponen lain
export const useSetGlobalLoading = () => {
    const setLoading = (loading: boolean) => {
        globalLoadingState.isLoading = loading;
        globalLoadingState.listeners.forEach(listener => listener(loading));
    };
    
    return setLoading;
};
