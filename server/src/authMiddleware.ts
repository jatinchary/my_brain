import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRATE } from "./config";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Invalid header. Authorization token is required.",
    });
    return;
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRATE!);

    //@ts-ignore
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Cannot verify token or token is invalid." });
    return;
  }
};
