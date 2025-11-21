const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CommentTableTestHelper = {
    async addComment({ id, content, owner }) {
        const query = {
            text: 'INSERT INTO threads(id, content, owner) VALUES($1, $2, $3)',
            values: [id, content, owner],
        };
        await pool.query(query);
    },
    async findCommentByThreadId(threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE thread_id = $1',
            values: [threadId],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};
module.exports = CommentTableTestHelper;
