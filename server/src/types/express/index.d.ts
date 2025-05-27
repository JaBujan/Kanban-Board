declare namespace Express {
    interface Request {
      user?: {
        username: string;
        id?: number; // Or string, depending on your user ID type
      };
    }
  }
