/**
 * Model of melody fragment
 */
module.exports = (sequelize, Sequelize) => {
    const MelodyFragment = sequelize.define('melody_fragment', {
        melodyId: {
            field: 'melody_id',
            type: Sequelize.UUID,
            primaryKey: true
        },
        position: {
            field: 'position',
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true
        },
        midiNumber: {
            field: 'midiNumber',
            type: Sequelize.INTEGER.UNSIGNED,
            validate: {
                min: 21,
                max: 108
            }
        },
        duration: {
            field: 'duration',
            type: Sequelize.FLOAT,
            allowNull: false
        },
    }, {
        tableName: 'melody_fragment',
        timestamps: false
    });
    return MelodyFragment;
}