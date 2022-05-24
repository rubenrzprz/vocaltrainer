const db = require("../models");
const MelodyFragment = db.melody_fragments;

/**
 * Method that adds a melody fragment
 * @param {*} req request
 * @param {*} res response
 */
exports.create = (req, res) => {
    if (!req.body.melodyId || !req.body.position || !req.body.midiNumber || !req.body.duration) {
        res.status(400).send({
            message: 'Cannot create melody fragment without melodyId, position, midiNumber and duration'
        });
        return;
    }
    MelodyFragment.create(req.body)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the melody fragment'
            })
        })
};

/**
 * Method that finds all the melody fragments
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    MelodyFragment.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving melody fragment'
        })
    })
};
/**
 * Method that finds melody fragments by id
 * @param {*} req request
 * @param {*} res response
 */
exports.findInMelody = (req, res) => {
    const melodyId = req.params.id;
    MelodyFragment.findAll({
        where: { melodyId: melodyId }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find melody fragments within melody with id=${melodyId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving melody fragments within melody with id=" + melodyId
            });
        });
};

/**
 * Method that update a melody fragment by id
 * @param {*} req request
 * @param {*} res response
 */
exports.update = (req, res) => {
    const { melodyId } = req.params;
    const { exercise }= req.body;
    try {
        MelodyFragment.destroy({where: {melodyId}}).then(() => {
            exercise.forEach(fragment => {
                MelodyFragment.create({...fragment, melodyId});
            })
            res.send({
                message: "Melody exercise updated successfully!"
            });
        })
    } catch (err) {
        res.status(500).send({
            message: `Could not update melody exercise with id=${melodyId}`
        });
    }
};

/**
 * Method that deletes a melody fragment by id
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const melodyId = req.params.melodyId;
    const position = req.params.position;
    MelodyFragment.destroy({
        where: {
            melodyId: melodyId,
            position: position
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Position from melody deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete position=${position} from melody with id=${melodyId}. Maybe the melody was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete position=${position} from melody with id=${melodyId}`
            });
        });
};

/**
 * Method that creates melody fragments for an exercise
 * @param {*} req request
 * @param {*} res response
 */
exports.createFullMelody = (req, res) => {
    const { exerciseId, exercise } = req.body;
    if (!exercise || !exerciseId) {
        res.status(400).send({
            message: 'Cannot create melody fragments without a melody or its id!'
        });
        return;
    }
    try {
        const parsedMelody = exercise.map((fragment, index) => {
            console.log(fragment);
            const { midiNumber, duration } = fragment;
            return {
                melodyId: exerciseId,
                position: index + 1,
                midiNumber,
                duration
            }})
        parsedMelody.forEach(fragment => MelodyFragment.create(fragment))
        res.send(parsedMelody);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the melody fragment'
        })
    }
}