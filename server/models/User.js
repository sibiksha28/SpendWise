import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model('User', userSchema)
