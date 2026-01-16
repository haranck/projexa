export const getErrorMessage = (error: unknown, fallback: string): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        return response?.data?.message || fallback;
    }
    return fallback;
};