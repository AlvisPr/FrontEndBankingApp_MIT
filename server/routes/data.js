const express = require('express');
const router = express.Router();
const Data = require('../models/Data');

// Get all data
router.get('/', async (req, res) => {
    try {
        const allData = await Data.find();
        res.json(allData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new data
router.post('/', async (req, res) => {
    const data = new Data({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newData = await data.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get specific data
router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update data
router.patch('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (req.body.title) {
            data.title = req.body.title;
        }
        if (req.body.description) {
            data.description = req.body.description;
        }
        const updatedData = await data.save();
        res.json(updatedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete data
router.delete('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        await data.remove();
        res.json({ message: 'Data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 