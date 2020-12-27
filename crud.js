'use strict';
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const process = require('process');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const argon2 = require('argon2');
const bodyParser = require('body-parser');
const passwordServ = require('./services/password');
const { generateToken, verifyToken } = require('./services/token');
const connection = require('./connection/connection');
connection()

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const User = mongoose.model('customer', {
    email: String,
    password: String,
    id: { type: String, default: uuidv4 }
});


//create new user
app.post('/customers', async (req, res) => {
    // req.body.password = await bcrypt.hash(req.body.password, 12);
    req.body.password = await passwordServ.hash(req.body.password);
    try {
        const data = await User.create(req.body);
        res.json(data);
    } catch (error) {
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

        // const iscorrect = await bcrypt.compare(req.body.password, customer.password);
        const iscorrect = await passwordServ.compare(req.body.password, customer.password);
        if (!iscorrect) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = await generateToken({
            userid: customer._id,
            email: customer.email
        });

        res.status(200).json({ token });

    } catch {
        res.status(500).json('Failed to login');
    }
})

//retrive the userlist
app.get('/users', async (req, res) => {
    try {
        const isAuthorized = await verifyToken(req.headers.authorization);
        const data = await User.find({  });
        res.json(data)
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorised user.. please login to access the api' });
    };

    try {
        const data = await User.find({}, { password: 0 });
        res.json(data)
    } catch (error) {
        res.status(500).json(error);
    }
});

//retrive the userlist
app.get('/users/:id', async (req, res) => {
    try {
        const data = await User.findOne({ id: req.params.id });
        res.json(data)
    } catch (error) {
        res.status(500).json(error);
    }
});

//update the userlist
app.put('/customers/:id', async (req, res) => {
    try {
        const data = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete the user
app.delete('/customers/:id', async (req, res) => {
    try {
        const data = await User.findOneAndDelete({ id: req.params.id });
        res.json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(4000, () => {
    console.log('Server listening at port 4000');
});