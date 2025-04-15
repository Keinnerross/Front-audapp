"use client";

interface LoadingOverlayProps {
  isLoading: boolean;
  isWhite?: boolean;
}

export default function LoadingOverlay({ isLoading, isWhite = false }: LoadingOverlayProps) {
  if (!isLoading) return null;
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-colors duration-200 ${isWhite ? "bg-white" : "bg-black/50"
        }`}
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-brand-500 rounded-full animate-spin" /> 

    </div>
  );
}
