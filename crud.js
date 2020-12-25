'use strict';
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const process = require('process');
const bcrypt = require('bcrypt');
const argon2 = require('argon2');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const connection = async () => {
    try {
        const data = await mongoose.connect('mongodb://localhost:27017/records', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to db');
    }
    catch {
        console.error('failed to connect Db');
        console.error(error);
        process.exit(1);
    }
}
connection();
const User = mongoose.model('customer', {
    email: String,
    password: String,
    id: { type: String, default: uuidv4 }
});

//create new user
app.post('/customers', async (req, res) => {
    // req.body.password = await bcrypt.hash(req.body.password, 12);
    req.body.password = await argon2.hash(req.body.password);
    try {
        const data = await User.create(req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

//Login
app.post('/login', async (req, res) => {
    try {
        const customer = await User.findOne({ email: req.body.email });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        const iscorrect = await bcrypt.compare(req.body.password, customer.password);
        if (!iscorrect) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        res.status(200).json({ message: 'Success' });
    }
    catch {
        res.status(500).json('Failed to login');
    }
})

//retrive the userlist
app.get('/customers', async (req, res) => {
    try {
        const data = await User.find({}, { password: 0 });
        res.json(data)
    }
    catch (error) {
        res.status(500).json(error);
    }
});

//retrive one user list
//retrive the userlist
app.get('/users/:id', async (req, res) => {
    try {
        const data = await User.findOne({ id: req.params.id });
        res.json(data)
    }
    catch (error) {
        res.status(500).json(error);
    }
});

//update the userlist
app.put('/customers/:id', async (req, res) => {
    try {
        const data = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

//delete the user
app.delete('/customers/:id', async (req, res) => {
    try {
        const data = await User.findOneAndDelete({ id: req.params.id });
        res.json(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
});

app.listen(4000, () => {
    console.log('Server listening at port 4000');
});