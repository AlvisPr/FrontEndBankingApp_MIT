const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw', 'transfer', 'transfer-sent', 'transfer-received']
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: String,
    balance: Number,
    fromAccount: String,
    toAccount: String,
    fromEmail: String,
    toEmail: String,
    fromName: String,
    toName: String
});

const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String
}, { _id: false });

const communicationPreferencesSchema = new Schema({
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    paperlessStatements: { type: Boolean, default: false }
}, { _id: false });

const sessionSchema = new Schema({
    token: String,
    deviceInfo: String,
    ip: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
}, { _id: false });

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return !this.isGoogleUser; // Password is required only if not using Google auth
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
    phoneNumber: {
        type: String,
        trim: true
    },
    photoURL: {
        type: String,
        default: null
    },
    balance: {
        type: Number,
        default: 0
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{17}$/.test(v);
            },
            message: props => `${props.value} is not a valid account number! Must be 17 digits.`
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    transactions: [transactionSchema],
    address: addressSchema,
    communicationPreferences: {
        type: communicationPreferencesSchema,
        default: () => ({})
    },
    createdAt: {
        type: Date,
        default: Date.now
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

// Add indexes
userSchema.index({ accountNumber: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);
module.exports = User;