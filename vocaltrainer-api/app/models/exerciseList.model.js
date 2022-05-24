/**
 * Model of exerciseList
*/
module.exports = (sequelize, Sequelize) => {
    const ExerciseList = sequelize.define('exercise_list', {
        listId: {
            field: 'list_id',
            type: Sequelize.UUID,
            primaryKey: true
        },
        exerciseId: {
            field: 'exercise_id',
            type: Sequelize.UUID,
            primaryKey: true
        },
        position: {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true
        }
    }, {
        tableName: 'exercise_list',
        timestamps: false
    });
    return ExerciseList;
}