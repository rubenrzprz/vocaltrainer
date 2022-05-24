/**
 * Model of profile
 */
module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define('profile', {
        userId: {
            field: 'user_id',
            type: Sequelize.UUID,
            primaryKey: true
        },
        biography: {
            type: Sequelize.STRING(300)
        },
        registrationDate: {
            field: 'registration_date',
            type: Sequelize.DATE
        },
        vocalRangeMax: {
            field: 'vocal_range_max',
            type: Sequelize.INTEGER.UNSIGNED,
            validate: {
                min: 1,
                max: 88
            }
        },
        vocalRangeMin: {
            field: 'vocal_range_min',
            type: Sequelize.INTEGER.UNSIGNED,
            validate: {
                min: 1,
                max: 88
            }
        },
        image: {
            type: Sequelize.STRING(50)
        }
    }, {
        tableName: 'profile',
        timestamps: false
    });
    return Profile;
}