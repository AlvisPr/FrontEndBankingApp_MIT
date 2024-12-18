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
}

module.exports = new UserDal();
