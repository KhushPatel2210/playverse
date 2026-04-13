const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  skillLevel: {
    type: String,
    enum: ["beginner", "intermediate/advanced"],
    required: true, // Changed to required
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
    required: true,
  },
  paymentId: { type: String }, // Add payment tracking
  orderId: { type: String }, // Add Razorpay order ID
  bookingDate: { type: Date, default: Date.now }, // Add booking date
  quantity: {
    // Add quantity field
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer",
    },
  },
  amount: {
    // Add total amount paid
    type: Number,
    required: true,
    min: 0,
  },
  refunded: { type: Boolean, default: false }, // Add refund status
  refundDate: { type: Date }, // Add refund date
  refundId: { type: String }, // Add refund ID from PayU
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  participantsLimit: {
    type: Number,
    required: true,
    min: 1,
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0,
  },
  participants: [participantSchema],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  actualPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  sportsName: {
    type: String,
    required: true,
    lowercase: true,
  },
  venueName: { type: String, required: true },
  venueImage: { type: String },
  location: { type: String, required: true },
  city: { type: String, required: true },
  mapUrl: { type: String }, // Add mapUrl field for Excel uploads

  slug: { type: String, unique: true, index: true },

  //counters
  confirmationCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  cancellationCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  notified75: {
    type: Boolean,
    default: false,
  },
  notified100: {
    type: Boolean,
    default: false,
  },
  cancellationReasons: {
    type: [String],
    default: [],
  },
  skillLevel: {
    type: String,
    enum: ["Any", "Beginner", "Intermediate/Advanced"],
    required: true,
  },
});

// Update the pre-save validation to only count confirmed participants
eventSchema.pre("save", function (next) {
  const successfulParticipants = this.participants.filter(
    (p) => p.paymentStatus === "success"
  );
  const totalBookedSlots = successfulParticipants.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  if (totalBookedSlots > this.participantsLimit) {
    const err = new Error(
      `Total confirmed bookings (${totalBookedSlots}) exceed event limit (${this.participantsLimit})`
    );
    return next(err);
  }
  next();
});
// Add index for better query performance
eventSchema.index({
  sportsName: 1,
  date: 1,
  "participants.paymentId": 1,
});

module.exports = mongoose.model("Event", eventSchema);