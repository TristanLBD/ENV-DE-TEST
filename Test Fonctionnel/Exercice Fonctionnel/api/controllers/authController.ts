import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { getRealm } from '../config/realm.js';
import { v4 as uuidv4 } from 'uuid';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  // Check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const realm = await getRealm();

    const existingUser = realm.objects('User').filtered('email == $0', email)[0];

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user: any;

    realm.write(() => {
      user = realm.create('User', {
        _id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const realm = await getRealm();
    const user: any = realm.objects('User').filtered('email == $0', email)[0];

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const realm = await getRealm();
    const user: any = realm.objectForPrimaryKey('User', req.user?.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const realm = await getRealm();
    const user = realm.objectForPrimaryKey('User', req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    realm.write(() => {
      realm.delete(user);
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
