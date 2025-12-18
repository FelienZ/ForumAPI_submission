/* eslint-disable no-unused-vars */
class CommentLikesRepository {
    async addLike(commentId, userId) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteLike(commentId, userId) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async isLiked(commentId, userId) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikesCountByCommentId(commentId) {
        throw new Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = CommentLikesRepository;
