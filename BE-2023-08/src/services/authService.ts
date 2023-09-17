import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models'; // Import your User model
import { UserModel } from '../models/User';
//import { UserModel } from '../models';

//const { User } = require('../models');

//import { User } from '../models';

export const getUserByUsername = async(username: string) =>{
    return await User.findOne({ where: { username } });
  };

  export const createUser = async (username: string, password: string, email: string) => {
    const newUser = await User.create({
      username: username,
      password: password,
      email: email,
    });
  
    return newUser;
  };
  





  export const authenticateUser = async (username: string, password: string) => {
    console.log('Trying to authenticate user:', username);
    
    const user = await User.findOne({ where: { username } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      console.log('Authentication failed for:', username);
      throw new Error('Invalid credentials');
    }
  
    console.log('Authentication successful for:', username);
  
    return user;
};

  
  export const createToken = (user: UserModel) => {
    // Create JWT token
    const token = jwt.sign({ sub: user.id }, 'your-secret-key', { expiresIn: '15m' });
    return token;
  };
  
