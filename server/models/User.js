const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    date: Date,
    from: String, // Email or ID of the sender
    to: String    // Email or ID of the receiver
});

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String
}, { _id: false });

const communicationPreferencesSchema = new mongoose.Schema({
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    paperlessStatements: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    balance: { type: Number, default: 0 },
    accountNumber: { type: String, unique: true },
    transactions: [transactionSchema],
    isAdmin: { type: Boolean, default: false },
    phoneNumber: String,
    address: addressSchema,
    preferredName: String,
    language: { type: String, default: 'English' },
    communicationPreferences: {
        type: communicationPreferencesSchema,
        default: () => ({})
    }
});

module.exports = mongoose.model('User', userSchema);