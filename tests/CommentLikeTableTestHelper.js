const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CommentLikeTableTestHelper = {
    async addLikes({
        id, commentId, userId,
    }) {
        const query = {
            text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES($1, $2, $3)',
            values: [id, commentId, userId],
        };
        await pool.query(query);
    },
    async findDataByCommentIdAndUserId(commentId, userId) {
        const query = {
            text: 'SELECT * from comment_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId],
        };
        const result = await pool.query(query);
        return result.rows;
    },
    async cleanTable() {
        await pool.query('DELETE FROM comment_likes WHERE 1=1');
    },
};
module.exports = CommentLikeTableTestHelper;
