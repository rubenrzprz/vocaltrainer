/**
 * Model of user
 */
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        userId: {
            field: 'user_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(30),
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'The provided email is not valid'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING(8),
            validate: {
                isIn: {
                    args: [['normal', 'employee', 'admin']],
                    msg: 'The provided role is not valid'
                }
            }
        }
    }, {
        tableName: 'user',
        timestamps: false
    });
    return User;
}