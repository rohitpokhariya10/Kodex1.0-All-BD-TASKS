import { User } from '../models/User.js';

export async function listUsers(req, res, next) {
  try {
    const search = req.query.search?.toString().trim();
    const filter = {
      _id: { $ne: req.user._id },
    };

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ name: 1 }).limit(25);

    res.json({ users });
  } catch (error) {
    next(error);
  }
}
