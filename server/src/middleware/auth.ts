import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload as VerifiedJwtPayload } from 'jsonwebtoken'; // Renamed imported JwtPayload to avoid conflict

// This interface can be extended if your JWT payload has more fields
interface AppJwtPayload extends VerifiedJwtPayload {
  username: string;
  id?: number; // Assuming id is part of your payload
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // if there isn't any token
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) {
      return res.sendStatus(403); // if token is no longer valid
    }
    // Type assertion for the decoded user payload
    req.user = decoded as AppJwtPayload;
    next(); // pass the execution to the next handler
    // Adding a return here to satisfy TS7030, though next() ends the middleware's direct response handling.
    return;
  });
  // Adding a return here to satisfy TS7030 for the main function, 
  // as jwt.verify is asynchronous and the function would otherwise implicitly return undefined.
  // However, in Express, middleware typically doesn't return a value after async operations like this
  // if res has been sent or next() has been called.
  // Depending on strictness, this might not be strictly necessary for runtime but satisfies the compiler.
  // A more common pattern might be to not have a return here if all paths within jwt.verify lead to a response or next().
  // For now, to clear the error, we add it.
  return; 
};
