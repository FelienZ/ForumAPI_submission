/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('comment_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('comment_likes', 'fk.comment_likes.comment_id.comments.id', 'FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE');
    pgm.addConstraint('comment_likes', 'fk.comment_likes.user_id.users.id', 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comment_likes', 'unique_comment_likes_userid_commentid', { unique: ['comment_id', 'user_id'] });
};

exports.down = (pgm) => {
    pgm.dropTable('comment_likes');
};
