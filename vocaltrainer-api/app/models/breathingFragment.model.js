/**
 * Model of breathing fragment
 */
module.exports = (sequelize, Sequelize) => {
    const BreathingFragment = sequelize.define('breathing_fragment', {
        breathingId: {
            field: 'breathing_id',
            type: Sequelize.UUID,
            primaryKey: true
        },
        position: {
            field: 'position',
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true
        },
        inhaleTime: {
            field: 'inhale_time',
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        holdTime: {
            field: 'hold_time',
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
        exhaleTime: {
            field: 'exhale_time',
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false
        },
    }, {
        tableName: 'breathing_fragment',
        timestamps: false
    });
    return BreathingFragment;
}