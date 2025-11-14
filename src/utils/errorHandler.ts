import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("✘ SERVER ERROR:", err);

	if (err instanceof ApiError) {
		res.status(err.statusCode).send({
			success: false,
			message: err.message,
			error: err.name,
		});
		return;
	}

	res.status(500).send({
		success: false,
		message: "Internal Server Error",
		error: "ServerError",
	});
};
