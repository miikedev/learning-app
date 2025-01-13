const mongoose = require('mongoose');

const connect = (uri) => {
    console.log('Connecting to MongoDB...');
    return mongoose.connect(uri)
    .then(() => 'connected successfully')
    .catch(err => console(err.message));
}

module.exports = connect