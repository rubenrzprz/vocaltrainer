const db = require("../models");
const Profile = db.profiles;

/**
 * Method that finds all the profiles
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    Profile.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving profiles'
        })
    })
};
/**
 * Method that find a profile by id
 * @param {*} req request
 * @param {*} res response
 */
exports.findOne = (req, res) => {
    const userId = req.params.id;
    Profile.findByPk(userId)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find profile for user with id=${userId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving profile for user with id=" + userId
            });
        });
};

/**
 * Method that updates a profile by id
 * @param {*} req request
 * @param {*} res response
 */
exports.update = (req, res) => {
    const userId = req.params.id;
    Profile.update(req.body, {
        where: { userId: userId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Profile updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update profile for user with id=${userId}. Maybe the profile was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating profile for user with id=" + userId
            });
        });
};
/**
 * Method that deletes a profile by id
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const userId = req.params.id;
    Profile.destroy({
        where: { userId: userId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Profile deleted successfully!"
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