import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const presenceStates = Object.freeze({
  AWAY: 'away',
  OFFLINE: 'offline',
  ONLINE: 'online',
});

const userSchema = new mongoose.Schema(
  {
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    lastSeenAt: {
      default: null,
      type: Date,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    passwordHash: {
      required: true,
      type: String,
    },
    status: {
      default: presenceStates.OFFLINE,
      enum: Object.values(presenceStates),
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
