const CommentLikesRepository = require('../CommentLikesRepository');

describe('CommentLikesRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
    // Arrange
        const commentLikesRepository = new CommentLikesRepository();

        // Action and Assert
        await expect(commentLikesRepository.addLike('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentLikesRepository.deleteLike('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentLikesRepository.isLiked('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentLikesRepository.getLikesCountByCommentId('')).rejects.toThrowError('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
