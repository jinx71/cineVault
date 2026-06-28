const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Watchlist is embedded (CineVault's lesson is infinite scroll, not relationships).
const watchlistItemSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterUrl: { type: String, default: null },
    voteAverage: { type: Number, default: 0 },
    releaseDate: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned by default
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    watchlist: { type: [watchlistItemSchema], default: [] },
  },
  { timestamps: true }
);

// Hash password before save (only when changed).
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
