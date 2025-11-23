const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
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
        const id = `comment-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO comments (id, content, owner, thread_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [id, content, owner, threadId],
        };
        const result = await this._pool.query(query);
        return new CommentData({ ...result.rows[0] });
    }

    // ubah validasi dari via getById menjadi verifyOwner
    async verifyCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT id FROM comments where id = $1 AND owner = $2',
            values: [commentId, userId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new AuthorizationError('Tidak Berhak Melakukan aksi ini');
        }
    }

    async verifyCommentExist(threadId, commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
            values: [commentId, threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Comment dalam thread ini Tidak tersedia');
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: 'SELECT c.id, c.date, c.content, c.is_delete, u.username FROM comments c JOIN users u ON c.owner = u.id WHERE c.thread_id = $1 ORDER BY c.date ASC',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        // pindah logic mapping ke use case buat ubah content
        return result.rows;
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1',
            values: [commentId],
        };
        await this._pool.query(query);
    }
}
module.exports = CommentRepositoryPostgres;
