import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models'; // Import your User model
import { UserModel } from '../models/User';
//import { UserModel } from '../models';


export const authenticateUser = async (username: string, password: string) => {
    const user = await User.findOne({ where: { username } });
  
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }
  
    return user;
  };

export const createToken = (user: UserModel) => {
  // Create JWT token
  const token = jwt.sign({ sub: user.id }, 'your-secret-key', { expiresIn: '15m' });
  return token;
};
