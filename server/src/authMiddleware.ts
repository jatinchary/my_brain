import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRATE } from "./config";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token is required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,JWT_SECRATE!) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    
    const errorMessage = error instanceof jwt.TokenExpiredError
      ? "Token expired"
      : "Invalid token";

    res.status(403).json({ message: errorMessage });
  }
};
