class BaseDal {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async findOne(filter) {
        return this.model.findOne(filter);
    }

    async find(filter = {}) {
        return this.model.find(filter);
    }

    async create(data) {
        const instance = new this.model(data);
        return instance.save();
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseDal;
