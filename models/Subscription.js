import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to calculate end date based on plan
SubscriptionSchema.statics.calculateEndDate = function (plan, startDate = new Date()) {
  const start = new Date(startDate);
  switch (plan) {
    case 'weekly':
      return new Date(start.setDate(start.getDate() + 7));
    case 'monthly':
      return new Date(start.setMonth(start.getMonth() + 1));
    case 'yearly':
      return new Date(start.setFullYear(start.getFullYear() + 1));
    default:
      return start;
  }
};

// Static method to get price based on plan
SubscriptionSchema.statics.getPlanPrice = function (plan) {
  const prices = {
    weekly: 499,
    monthly: 1499,
    yearly: 9999,
  };
  return prices[plan] || 0;
};

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
