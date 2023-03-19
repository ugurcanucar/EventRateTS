import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class MiddleWares {
  static verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ): any => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "Secret_KEY"
      );
      console.log(decodedToken);
      next();
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
  };
}
