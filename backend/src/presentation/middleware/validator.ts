import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { HTTP_STATUS } from "../../domain/constants/httpStatus";

export const validateRequest = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })) as { body?: unknown; query?: unknown; params?: unknown };

            // Assign coerced/validated values back to the request object safely without 'any'
            req.body = parsed.body;
            req.query = parsed.query as Record<string, string | string[] | undefined>;
            req.params = parsed.params as Record<string, string>;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map((issue) => ({
                        field: issue.path.slice(1).join("."), // removes 'body', 'query', or 'params' from path
                        message: issue.message,
                    })),
                });
                return;
            }

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error during validation",
            });
        }
    };
};
