import { z } from 'zod';
import { User, presenceStates } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { signAuthToken } from '../utils/jwt.js';

export const registerSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  name: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export const presenceSchema = z.object({
  status: z.enum([presenceStates.AWAY, presenceStates.OFFLINE, presenceStates.ONLINE]),
});

export async function register(req, res, next) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      throw new HttpError(409, 'An account with this email already exists.');
    }

    const passwordHash = await User.hashPassword(req.body.password);
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      passwordHash,
      status: presenceStates.ONLINE,
    });

    res.status(201).json({
      token: signAuthToken(user),
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await user.verifyPassword(req.body.password))) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    user.status = presenceStates.ONLINE;
    user.lastSeenAt = null;
    await user.save();

    res.json({
      token: signAuthToken(user),
      user,
    });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: req.user });
}

export async function updatePresence(req, res, next) {
  try {
    req.user.status = req.body.status;
    req.user.lastSeenAt = req.body.status === presenceStates.OFFLINE ? new Date() : null;
    await req.user.save();

    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
