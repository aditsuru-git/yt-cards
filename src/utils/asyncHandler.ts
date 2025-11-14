import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = <
	T extends {
		params?: Record<string, any>;
		resBody?: any;
		reqBody?: any;
		reqQuery?: Record<string, any>;
	} = {}
>(
	fn: (
		req: Request<T["params"], T["resBody"], T["reqBody"], T["reqQuery"]>,
		res: Response<T["resBody"]>,
		next: NextFunction
	) => Promise<any>
): RequestHandler<T["params"], T["resBody"], T["reqBody"], T["reqQuery"]> => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
