const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const ReplyTableTestHelper = {
    async addReply({ id, content, owner }) {
        const query = {
            text: 'INSERT INTO replies(id, content, owner) VALUES($1, $2, $3)',
            values: [id, content, owner],
        };
        await pool.query(query);
    },
    async findRepliesByCommentId(commentId) {
        const query = {
            text: 'SELECT * FROM replies WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0];
    },
    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
    },
};
module.exports = ReplyTableTestHelper;
