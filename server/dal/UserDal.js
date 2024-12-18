const BaseDal = require('./BaseDal');
const User = require('../models/User');

class UserDal extends BaseDal {
    constructor() {
        super(User);
    }

    async findUserById(userId) {
        return this.findById(userId);
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }

    async findByGoogleId(googleId) {
        return this.findOne({ googleId });
    }

    async findByAccountNumber(accountNumber) {
        return this.findOne({ accountNumber });
    }

    async findUserByEmailOrGoogleId(email, googleId) {
        return this.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { googleId }
            ]
        });
    }

    async updateBalance(userId, newBalance) {
        return this.update(userId, { balance: newBalance });
    }

    async addTransaction(userId, transaction) {
        return this.model.findByIdAndUpdate(
            userId,
            { $push: { transactions: transaction } },
            { new: true }
        );
    }

    async findUsersWithoutPassword() {
        return this.model.find({}).select('-password');
    }

    async updateSession(userId, sessionData) {
        return this.model.findByIdAndUpdate(
            userId,
            { $push: { activeSessions: sessionData } },
            { new: true }
        );
    }

    async removeSession(userId, sessionId) {
        return this.model.findByIdAndUpdate(
            userId,
            { $pull: { activeSessions: { _id: sessionId } } },
            { new: true }
        );
    }

    async getTransactions(userId) {
        const user = await this.findById(userId);
        return user ? user.transactions : [];
    }
}

module.exports = new UserDal();
