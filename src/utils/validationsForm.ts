
export interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
  }
  
  export const VALIDAR = false; // Cambia esto a false para desactivar validaciones
  
  export const validateRequired = (value: any, message: string): ValidationResult | null => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && value.length === 0);
  
    return isEmpty ? { isValid: false, errorMessage: message } : null;
  };