const mongoose = require('mongoose');
const connection = async () => {
    try {
        const data = await mongoose.connect('mongodb://localhost:27017/records', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to db');
    } catch(error) {
        console.error('failed to connect Db');
        console.error(error);
        process.exit(1);
    }
}

module.exports = connection;