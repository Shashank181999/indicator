import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  plan: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    default: 'mock',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique transaction ID
PaymentSchema.statics.generateTransactionId = function () {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TXN_${timestamp}_${randomStr}`.toUpperCase();
};

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
