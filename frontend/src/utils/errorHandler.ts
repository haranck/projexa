export const getErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
    if (!error) return fallback;

    if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        return err.response?.data?.message || fallback;
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
};

