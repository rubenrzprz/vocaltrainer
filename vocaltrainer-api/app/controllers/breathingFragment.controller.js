const db = require("../models");
const BreathingFragment = db.breathing_fragments;

/**
 * Method that adds a breathing fragment
 * @param {*} req request
 * @param {*} res response
 */
exports.create = (req, res) => {
    console.log(req.body);
    if (!req.body.breathingId || !req.body.position || !req.body.inhaleTime || !req.body.holdTime || !req.body.exhaleTime) {
        res.status(400).send({
            message: 'Cannot create breathing fragment without breathingId, position, inhaleTime, holdTime and exhaleTime'
        });
        return;
    }
    const breathingFragment = {
        breathingId: req.body.breathingId,
        position: req.body.position,
        inhaleTime: req.body.inhaleTime,
        holdTime: req.body.holdTime,
        exhaleTime: req.body.exhaleTime
    }
    BreathingFragment.create(breathingFragment)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the breathing fragment'
            })
        })
};
/**
 * Method that finds all the breathing fragments
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    BreathingFragment.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving breathing fragments'
        })
    })
};

/**
 * Method that finds breathing fragment by id
 * @param {*} req request
 * @param {*} res response
 */
exports.findInBreathing = (req, res) => {
    const breathingId = req.params.id;
    BreathingFragment.findAll({
        where: { breathingId: breathingId }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find breathing fragments within breathing exercise with id=${breathingId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving breathing fragments within breathing exercise with id=" + breathingId
            });
        });
};

/**
 * Method that updates a breathing fragment by id
 * @param {*} req request
 * @param {*} res response
 */
exports.update = (req, res) => {
    const { breathingId } = req.params;
    const { exercise } = req.body;
    try {
        BreathingFragment.destroy({where: {breathingId}}).then(() => {
            exercise.forEach(fragment => {
                BreathingFragment.create({...fragment, breathingId});
            })
            res.send({
                message: "Breathing exercise updated successfully!"
            });
        })
        res.send({
            message: "Breathing exercise updated successfully!"
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not update breathing exercise with id=${breathingId}`
        });
    }
};

/**
 * Method that deletes a breathing fragment by id
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const breathingId = req.params.breathingId;
    const position = req.params.position;
    BreathingFragment.destroy({
        where: {
            breathingId: breathingId,
            position: position
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Position from breathing exercise deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete position=${position} from breathing exercise with id=${breathingId}. Maybe the breathing exercise was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete position=${position} from breathing exercise with id=${breathingId}`
            });
        });
};

/**
 * Method that creates breathing fragments for an exercise
 * @param {*} req request
 * @param {*} res response
 */
exports.createFullExercise = (req, res) => {
    const { exerciseId, exercise } = req.body;
    if (!exercise || !exerciseId) {
        res.status(400).send({
            message: 'Cannot create breathing fragments without an exercise or its id!'
        });
        return;
    }
    try {
        const parsedBreathing = exercise.map((fragment, index) => {
            return Object.assign(fragment, {breathingId: exerciseId, position: index+1});
        })
        parsedBreathing.forEach(fragment => BreathingFragment.create(fragment));
        res.send(parsedBreathing);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the melody fragment'
        })
    }
}