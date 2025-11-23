class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, userId } = useCasePayload;
        await this._threadRepository.verifyThreadExist(threadId);
        // pindah validasi match comment & thread ke sini juga:
        await this._commentRepository.verifyCommentExist(threadId, commentId);
        // pindah validasi otorisasi ke sini:
        await this._commentRepository.verifyCommentOwner(commentId, userId);
        await this._commentRepository.deleteComment(commentId);
    }
}
module.exports = DeleteCommentUseCase;
