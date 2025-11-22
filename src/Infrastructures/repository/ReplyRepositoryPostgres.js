const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyData = require('../../Domains/replies/entities/ReplyData');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(replyData) {
        const { content, owner, commentId } = replyData;
        const id = `reply-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO replies (id, comment_id, content, owner) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [id, commentId, content, owner],
        };
        const result = await this._pool.query(query);
        return new ReplyData({ ...result.rows[0] });
    }

    async verifyReplyExist(replyId) {
        const checkQuery = {
            text: 'SELECT id FROM replies WHERE id = $1',
            values: [replyId],
        };
        const checkResult = await this._pool.query(checkQuery);
        if (!checkResult.rows.length) {
            throw new NotFoundError('Reply tidak ditemukan');
        }
    }

    async getReplyById(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Reply Tidak ditemukan');
        }
        return new ReplyData({ ...result.rows[0] });
    }

    async getRepliesByCommentId(commentId) {
        const query = {
            text: 'SELECT r.id, r.date, r.content, r.is_delete, u.username FROM replies r JOIN users u ON r.owner = u.id WHERE r.comment_id = $1 ORDER BY r.date ASC',
            values: [commentId],
        };
        const result = await this._pool.query(query);
        // pindah mapping ke use case juga
        return result.rows;
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [replyId],
        };
        await this._pool.query(query);
    }
}
module.exports = ReplyRepositoryPostgres;
