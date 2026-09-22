import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    merchant: {
      type: String,
      required: [true, 'Merchant is required'],
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      enum: ['housing', 'food', 'transport', 'shopping', 'subscriptions', 'health', 'entertainment', 'other'],
      default: 'other',
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    occurredAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

transactionSchema.index({ user: 1, occurredAt: -1 })
transactionSchema.index({ user: 1, category: 1, occurredAt: -1 })

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)
