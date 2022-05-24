/**
 * Model of comment
 */
module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        commentId: {
            field: 'comment_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        userId: {
            field: 'user_id',
            type: Sequelize.UUID,
            allowNull: false
        },
        publicationId: {
            field: 'publication_id',
            type: Sequelize.UUID,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING(500),
            allowNull: false
        },
    }, {
        tableName: 'comment'
    });
    return Comment;
}