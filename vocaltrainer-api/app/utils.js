require('dotenv').config();
const bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
const jwt = require('express-jwt');

/**
 * Function that check if a password matches a hashedPassword
 * @param {*} password to validate
 * @param {*} hashedPassword hash to compare with
 * @returns promise whether the password validates or not
 */
const validatePassword = async (password, hashedPassword) => {
    return new Promise(resolve => {
        bcrypt.compare(password, hashedPassword, (err, res) => {
            resolve(res);
        })
    })
}

/**
 * Function that hashes a password
 * @param {*} password to hash
 * @returns hashed password
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Creates a JWT for the user
 * @param {*} user
 * @returns token for the user
 */
const createToken = (user) => {
    if (!user.role) {
        throw new Error("No user role specified");
    }
    return jsonwt.sign(
        {
            userId: user.userId,
            email: user.email,
            role: user.role,
            iss: 'api.vocaltrainer',
            aud: 'api.vocaltrainer'
        },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: process.env.SESSION_MAX_AGE || '3h' }
    )
}

/**
 * JWT request handler
 */
const requireAuth = jwt({
    secret: process.env.JWT_SECRET,
    audience: 'api.vocaltrainer',
    issuer: 'api.vocaltrainer',
    algorithms: ['HS256']
})

/**
 * Check if an user has the sufficient role to perform an action
 * @param {*} req request
 * @param {*} res response
 * @param {*} next 
 */
const requireAdmin = (req, res, next) => {
    const { role } = req.user;
    if(role !== 'admin') {
        return res.status(401).json({
            message: 'Insufficient role'
        })
    }
    next();
}

module.exports = {
    validatePassword,
    hashPassword,
    createToken,
    requireAuth,
    requireAdmin
}