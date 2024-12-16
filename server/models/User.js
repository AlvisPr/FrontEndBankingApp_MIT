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

const sessionSchema = new mongoose.Schema({
    secret: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only if not using Google auth
        }
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    balance: { type: Number, default: 0 },
    accountNumber: { type: String, unique: true },
    transactions: [transactionSchema],
    isAdmin: { type: Boolean, default: false },
    phoneNumber: String,
    address: addressSchema,
    preferredName: String,
    profilePicture: { 
        type: String, 
        default: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff' // Default avatar URL
    },
    language: { type: String, default: 'English' },
    communicationPreferences: {
        type: communicationPreferencesSchema,
        default: () => ({})
    },
    activeSessions: [sessionSchema]
});

// Clean up expired sessions
userSchema.methods.cleanExpiredSessions = async function() {
    this.activeSessions = this.activeSessions.filter(session => 
        session.expiresAt > new Date()
    );
    if (this.isModified('activeSessions')) {
        await this.save();
    }
};

module.exports = mongoose.model('User', userSchema);