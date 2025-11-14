import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("SERVER ERROR:", err); // Log the full error internally

	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	res.status(statusCode).send({
		success: false,
		message: message,
		error: err.name,
	});
};
