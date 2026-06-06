import mongoose from 'mongoose';

export const messageStatus = Object.freeze({
  DELIVERED: 'delivered',
  READ: 'read',
  SENT: 'sent',
});

const readReceiptSchema = new mongoose.Schema(
  {
    readAt: {
      default: Date.now,
      type: Date,
    },
    userId: {
      ref: 'User',
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    authorId: {
      ref: 'User',
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    body: {
      maxlength: 2000,
      required: true,
      trim: true,
      type: String,
    },
    conversationId: {
      index: true,
      ref: 'Conversation',
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    deletedAt: {
      default: null,
      type: Date,
    },
    readBy: [readReceiptSchema],
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

messageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
