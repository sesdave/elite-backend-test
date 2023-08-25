import { Request, Response } from 'express';
import { authenticateUser, createToken, createUser, getUserByUsername } from '../services/authService';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const authService = require('../services/authService');


export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(username, hashedPassword, email);

    if (!newUser) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    //const token = jwt.sign({ sub: newUser.id }, 'your-secret-key', { expiresIn: '15m' });
    const token = jwt.sign({ sub: newUser.id }, 'your-secret-key', { expiresIn: '15m' });


    res.json({ message: 'User created successfully', token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);
    const token = createToken(user);
    
    // Set JWT token cookie here if needed

    res.json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};


export const logout = (req: Request, res: Response) => {
  // Clear JWT token cookie here if needed

  res.json({ message: 'Logged out successfully' });
};
