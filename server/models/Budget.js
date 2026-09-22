import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['overall', 'housing', 'food', 'transport', 'shopping', 'subscriptions', 'health', 'entertainment', 'other'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0.01, 'Budget must be greater than zero'],
    },
    period: {
      type: String,
      enum: ['monthly', 'weekly'],
      default: 'monthly',
      required: true,
    },
    startsOn: {
      type: Date,
      required: true,
    },
    endsOn: {
      type: Date,
      required: true,
    },
    alertAt: {
      type: Number,
      min: 1,
      max: 100,
      default: 80,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

budgetSchema.path('endsOn').validate(function (endsOn) {
  return endsOn > this.startsOn
}, 'Budget end date must be after its start date')

budgetSchema.index({ user: 1, category: 1, startsOn: 1 }, { unique: true })

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema)
