const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CommentData = require('../../Domains/comments/entities/CommentData');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(commentData) {
        const { content, owner, threadId } = commentData;
        // cek thread ada?
        const checkQuery = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };
        const checkResult = await this._pool.query(checkQuery);
        if (!checkResult.rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }
        const id = `comment-${this._idGenerator()}`;
        const insertQuery = {
            text: 'INSERT INTO comments (id, content, owner, thread_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [id, content, owner, threadId],
        };
        const result = await this._pool.query(insertQuery);
        return new CommentData({ ...result.rows[0] });
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: 'SELECT c.id, c.date, c.content, c.is_delete, u.username FROM comments c JOIN users u ON c.owner = u.id WHERE c.thread_id = $1 ORDER BY c.date ASC',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        return result.rows.map((r) => ({
            id: r.id,
            username: r.username,
            content: r.is_delete ? '**komentar telah dihapus**' : r.content,
            date: r.date,
        }));
    }

    async getCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('comment tidak ditemukan');
        }
        return new CommentData({
            id: result.rows[0].id,
            content: result.rows[0].content,
            threadId: result.rows[0].thread_id,
            isDelete: result.rows[0].is_delete,
            date: result.rows[0].date,
            owner: result.rows[0].owner,
        });
    }

    async deleteComment(commentId) {
        const checkQuery = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        };
        const checkResult = await this._pool.query(checkQuery);
        if (!checkResult.rows.length) {
            throw new NotFoundError('comment tidak ditemukan');
        }
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1',
            values: [commentId],
        };
        await this._pool.query(query);
    }
}
module.exports = CommentRepositoryPostgres;
