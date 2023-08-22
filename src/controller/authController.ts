import { Request, Response } from 'express';
import { authenticateUser, createToken } from '../services/authService';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);
    const token = createToken(user);
    
    // Set JWT token cookie here if needed

    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  // Clear JWT token cookie here if needed

  res.json({ message: 'Logged out successfully' });
};
