import type { ReactNode } from "react";

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error) => void;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}