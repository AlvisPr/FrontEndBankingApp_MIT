const User = require('../models/User');

class UserDal {
    constructor() {
        this.model = User;
    }

    async findUserById(userId) {
        return await this.model.findById(userId);
    }

    async findUserByEmail(email) {
        return await this.model.findOne({ email });
    }

    async findByGoogleId(googleId) {
        return await this.model.findOne({ googleId });
    }

    async findByAccountNumber(accountNumber) {
        return await this.model.findOne({ accountNumber });
    }

    async findUserByEmailOrGoogleId(email, googleId) {
        return await this.model.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { googleId }
            ]
        });
    }

    async updateBalance(userId, newBalance) {
        return await this.model.findByIdAndUpdate(
            userId,
            { $set: { balance: newBalance } },
            { new: true }
        );
    }

    async addTransaction(userId, transaction) {
        return await this.model.findByIdAndUpdate(
            userId,
            { $push: { transactions: transaction } },
            { new: true }
        );
    }

    async findUsersWithoutPassword() {
        return await this.model.find({}).select('-password');
    }

    async deleteUser(userId) {
        const result = await this.model.findByIdAndDelete(userId);
        return result;
    }

    async updateSession(userId, sessionData) {
        return await this.model.findByIdAndUpdate(
            userId,
            { $push: { activeSessions: sessionData } },
            { new: true }
        );
    }

    async removeSession(userId, sessionId) {
        return await this.model.findByIdAndUpdate(
            userId,
            { $pull: { activeSessions: { _id: sessionId } } },
            { new: true }
        );
    }

    async getTransactions(userId) {
        const user = await this.model.findById(userId);
        return user ? user.transactions : [];
    }

    async createUser(userData) {
        const user = new this.model(userData);
        return await user.save();
    }

    async findByIdAndUpdate(userId, update, options = {}) {
        const defaultOptions = {
            new: true,           // Return the modified document
            runValidators: true  // Run model validators
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        // If we're using $set, keep it as is, otherwise wrap in $set
        const finalUpdate = update.$set ? update : { $set: update };
        
        try {
            const updatedUser = await this.model.findByIdAndUpdate(userId, finalUpdate, mergedOptions);
            return updatedUser;
        } catch (error) {
            console.error('Error in findByIdAndUpdate:', error);
            throw error;
        }
    }
}

module.exports = new UserDal();
