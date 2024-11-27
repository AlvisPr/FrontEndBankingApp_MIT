const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    date: Date,
    from: String, // Email or ID of the sender
    to: String    // Email or ID of the receiver
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    balance: { type: Number, default: 0 },
    accountNumber: { type: String, unique: true },
    transactions: [transactionSchema],
    isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);