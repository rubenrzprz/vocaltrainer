const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

/**
 * Method that finds all the users
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    User.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving users'
        })
    })
};
/**
 * Method that finds a user by its id
 * @param {*} req request
 * @param {*} res response
 */
exports.findOne = (req, res) => {
    const userId = req.params.id;
    User.findByPk(userId)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find user with id=${userId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving user with id=" + userId
            });
        });
};
/**
 * Method that updates a user
 * @param {*} req request
 * @param {*} res response
 */
exports.update = (req, res) => {
    const userId = req.params.id;
    User.update(req.body, {
        where: { userId: userId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update user with id=${userId}. Maybe user was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + userId
            });
        });
};
/**
 * Method that deletes a the user
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const userId = req.params.id;
    User.destroy({
        where: { userId: userId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete user with id=${userId}. Maybe user was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + userId
            });
        });
};
/**
 * Method that finds a user by name
 * @param {*} req request
 * @param {*} res response
 */
exports.findByName = (req, res) => {
    const { name } = req.params;
    User.findAll({
        where: { 
            username: {
                [Op.startsWith]: name
            }
        },
        raw: true
    })
        .then(data => {
            if (data) {
                res.send(data.map(user => {
                    const { username, userId } = user;
                    return { username, userId };
                }));
            } else {
                res.status(404).send({
                    message: `Cannot find publications with name=${name}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving publications with name=" + name
            });
        });
}