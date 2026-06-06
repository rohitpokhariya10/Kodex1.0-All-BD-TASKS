import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { verifyAuthToken } from '../utils/jwt.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.get('authorization') ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new HttpError(401, 'Authentication token is required.');
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new HttpError(401, 'Authenticated user no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new HttpError(401, 'Invalid or expired authentication token.'));
      return;
    }

    next(error);
  }
}
