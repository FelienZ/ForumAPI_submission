const CommentLikesRepository = require('../../Domains/commentlikes/CommentLikesRepository');

class CommentLikesRepositoryPostgres extends CommentLikesRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(commentId, userId) {
        const id = `like-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3)',
            values: [id, commentId, userId],
        };
        await this._pool.query(query);
    }

    async deleteLike(commentId, userId) {
        const query = {
            text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId],
        };
        await this._pool.query(query);
    }

    async isLiked(commentId, userId) {
        const query = {
            text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2 LIMIT 1',
            values: [commentId, userId],
        };
        const result = await this._pool.query(query);
        return result.rowCount > 0;
    }

    async getLikesCountByCommentId(commentId) {
        const query = {
            text: 'SELECT COUNT(*) AS count FROM comment_likes WHERE comment_id = $1',
            values: [commentId],
        };
        const result = await this._pool.query(query);
        return Number(result.rows[0].count);
    }
}

module.exports = CommentLikesRepositoryPostgres;
