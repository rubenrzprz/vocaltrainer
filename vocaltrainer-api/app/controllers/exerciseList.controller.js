const db = require("../models");
const ExerciseList = db.exercise_lists;
const Op = db.Sequelize.Op;

/**
 * Method that adds an exerciseList
 * @param {*} req request
 * @param {*} res response
 */
exports.create = async (req, res) => {
    const { listId, exerciseId } = req.body;
    if (!listId || !exerciseId) {
        res.status(400).send({
            message: 'Cannot create exercise list without listId and exerciseId'
        });
        return;
    }
    const lastPosition = await ExerciseList.count({
        where: {
            listId
        }
    });

    const exerciseList = {
        listId,
        exerciseId,
        position: lastPosition + 1
    }
    ExerciseList.create(exerciseList)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the exercise list'
            })
        })
};

/**
 * Method that finds all exerciseLists
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    ExerciseList.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving exercise lists'
        })
    })
};

/**
 * Method that finds all publications of an exerciseList
 * @param {*} req request
 * @param {*} res response
 */
exports.findInList = (req, res) => {
    const listId = req.params.id;
    ExerciseList.findAll({
        where: { listId },
        raw: true
    })
        .then(async(data) => {
            if (data) {
                const Publications = db.publications;
                const formattedData = await Promise.all(data.map(async (exercise) => {
                    const exerciseInfo = await Publications.findOne({
                        where: {
                            publicationId: exercise.exerciseId
                        }, 
                        raw: true
                    });
                    return {
                        exercise: exerciseInfo,
                        position: exercise.position
                    }
                }))
                res.send(formattedData);
            } else {
                res.status(404).send({
                    message: `Cannot find exercise within list with id=${listId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving exercise within list with id=" + listId
            });
        });
};

/**
 * Method that finds all lists iwith an exercise id in them
 * @param {*} req request
 * @param {*} res response
 */
exports.findLists = (req, res) => {
    const exerciseId = req.params.id;
    ExerciseList.findAll({
        where: { exerciseId: exerciseId }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find lists containing exercise with id=${exerciseId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving lists containing exercise with id=" + exerciseId
            });
        });
};

/**
 * Method that deletes an exercise list
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const {listId, exerciseId} = req.params;
    ExerciseList.destroy({
        where: {
            listId,
            exerciseId
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Exercise in list deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete exercise with id=${exerciseId} from list with id=${listId}. Maybe the exercise was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete exercise with id=${exerciseId} from list with id=${listId}`
            });
        });
};


/**
 * Method that update an exerciseList
 * @param {*} req request
 * @param {*} res response
 */
exports.updateList = async (req, res) => {
    const { listId } = req.params;
    const { exercises } = req.body;
    console.log(req.body);
    ExerciseList.destroy({
        where: {
            listId
        }
    }).then(() => {
        console.log(exercises);
        exercises.forEach(item => {
            const position = item.position + 1;
            const exerciseId = item.exercise.publicationId;
            ExerciseList.create({listId, exerciseId, position })
        })
    }).catch(err => {
        res.status(500).send({
            message: `Could not update list with id=${listId}`
        });
    });
}