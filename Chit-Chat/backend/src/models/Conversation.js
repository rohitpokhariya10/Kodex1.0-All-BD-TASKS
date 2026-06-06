import mongoose from 'mongoose';

export const conversationTypes = Object.freeze({
  DIRECT: 'direct',
  GROUP: 'group',
});

const conversationSchema = new mongoose.Schema(
  {
    createdBy: {
      ref: 'User',
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    directKey: {
      default: undefined,
      trim: true,
      type: String,
    },
    lastMessageAt: {
      default: null,
      type: Date,
    },
    memberIds: [
      {
        ref: 'User',
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    title: {
      default: null,
      trim: true,
      type: String,
    },
    type: {
      enum: Object.values(conversationTypes),
      required: true,
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
        return ret;
      },
    },
  },
);

conversationSchema.index({ directKey: 1 }, { sparse: true, unique: true });
conversationSchema.index({ memberIds: 1, lastMessageAt: -1 });

conversationSchema.methods.hasMember = function hasMember(userId) {
  return this.memberIds.some((memberId) => memberId.toString() === userId.toString());
};

export const Conversation = mongoose.model('Conversation', conversationSchema);
