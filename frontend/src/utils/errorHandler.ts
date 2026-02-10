// export const getErrorMessage = (error: unknown, fallback: string): string => {
//     if (error && typeof error === 'object' && 'response' in error) {
//         const response = (error as { response?: { data?: { message?: string } } }).response;
//         return response?.data?.message || fallback;
//     }
//     return fallback;
// };

export const getErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
    if (!error) return fallback;

    // Axios error
    if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        return err.response?.data?.message || fallback;
    }

    // Normal JS error
    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
};

