import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  field?: string;
  details?: any;
}

export class ErrorHandler {
  static handleApiError(error: AxiosError): ApiError {
    if (!error.response) {
      return {
        message: 'Network error. Please check your connection.',
        status: 500,
      };
    }

    const { status, data } = error.response;
    let message = 'An unexpected error occurred.';
    let field = '';

    switch (status) {
      case 400:
        if (typeof data === 'object' && data !== null) {
          // Handle validation errors
          const errorMessages = Object.entries(data).map(([key, value]) => {
            field = key;
            return Array.isArray(value) ? value.join(', ') : String(value);
          });
          message = errorMessages.join('. ');
        } else {
          message = 'Invalid request data.';
        }
        break;

      case 401:
        message = 'Authentication required. Please login.';
        break;

      case 403:
        message = 'You do not have permission to perform this action.';
        break;

      case 404:
        message = 'The requested resource was not found.';
        break;

      case 429:
        message = 'Too many requests. Please try again later.';
        break;

      case 500:
        message = 'Server error. Please try again later.';
        break;

      default:
        message = (data as any)?.detail || `Error ${status}: Something went wrong.`;
    }

    return {
      message,
      status,
      field,
      details: data,
    };
  }

  static showError(error: any, showToast?: (message: string) => void): void {
    const apiError = this.handleApiError(error);
    
    if (showToast) {
      showToast(apiError.message);
    } else {
      console.error('API Error:', apiError);
    }
  }
}
