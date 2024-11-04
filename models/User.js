const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        index: true
    },
    email: {
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true
    },
    isCreator: {
        type: Boolean,
        default: false
    },
    salt: String,
    hash: String,
    token: {
        type: String,
        nullable: true,
    }
  },
  { timestamps: true }
);


UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateToken = function() {
    this.token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
    return this.token;
};

UserSchema.statics.createDefaultAdmin = async function(username, email, password) {
    const admin = new this({
        username: username,
        email: email,
        isCreator: true
    });
    admin.setPassword(password);
    await admin.save();
    return admin;
};

module.exports = mongoose.model('User', UserSchema);
