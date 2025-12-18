class ToggleCommentLikeUseCase {
    constructor({ commentRepository, threadRepository, commentLikeRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._commentLikesRepository = commentLikeRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, userId } = useCasePayload;
        await this._threadRepository.verifyThreadExist(threadId);
        await this._commentRepository.verifyCommentExist(threadId, commentId);
        const isLiked = await this._commentLikesRepository.isLiked(commentId, userId);
        if (isLiked) {
            await this._commentLikesRepository.deleteLike(commentId, userId);
        } else {
            await this._commentLikesRepository.addLike(commentId, userId);
        }
    }
}

module.exports = ToggleCommentLikeUseCase;
