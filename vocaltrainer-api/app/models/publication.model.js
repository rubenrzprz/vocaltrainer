/**
 * Model of publication
 */
module.exports = (sequelize, Sequelize) => {
    const Publication = sequelize.define('publication', {
        publicationId: {
            field: 'publication_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        userId: {
            field: 'user_id',
            type: Sequelize.UUID,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(300)
        },
        type: {
            type: Sequelize.STRING(10),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['b-exercise', 'm-exercise', 'list']],
                    msg: 'The provided type is not valid'
                }
            }
        }
    }, {
        tableName: 'publication',
        timestamps: true
    });
    return Publication;
}