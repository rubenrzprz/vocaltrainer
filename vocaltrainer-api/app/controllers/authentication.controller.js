const db = require("../models");
const User = db.users;
const { createToken, hashPassword, validatePassword} = require('../utils');
const jwtDecode = require('jwt-decode')

/**
 * Method that logs the user into the application
 * @param {*} req request
 * @param {*} res response
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email }, raw: true });

        if (!user) {
            return res.status(403).json({
                message: 'Wrong email or password.'
            })
        }

        const authenticated = await validatePassword(password, user.password);
        if (authenticated) {
            const { password, ...rest } = user;
            const userInfo = Object.assign({}, { ...rest });

            const token = createToken(userInfo);
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;

            res.json({
                message: 'Authentication successful!',
                token,
                userInfo,
                expiresAt
            })
        } else {
            res.status(403).json({
                message: 'Wrong email or password.'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.toString()
        })
    }
}

/**
 * Method that register the user into the application
 * @param {*} req request
 * @param {*} res response
 */
exports.signup = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        const hashedPassword = await hashPassword(password);

        const userData = {
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role ? role : 'normal'
        }

        const existingEmail = await User.findOne({
            where: 
                {email: userData.email}, 
            raw: true
        });

        if(existingEmail) {
            return res.status(400).json({
                message: 'Email already exists.'
            })
        }

        const existingUser = await User.findOne({
            where: 
                {username: userData.username}, 
            raw: true
        });

        if(existingUser) {
            return res.status(400).json({
                message: 'User already exists.'
            })
        }
        
        const savedUser = await User.create(userData);
        const data = savedUser.get({plain: true});

        if(data) {
            const {
                username,
                email,
                role,
                userId
            } = data;

            const userInfo = {
                username,
                email,
                role,
                userId
            }

            return res.json({
                message: 'User created!',
                userInfo
            })
        } else {
            return res.status(400).json({
                message: 'There was an error creating your account.'
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: err.toString()//'There was an error creating your account.'
        })
    }
};