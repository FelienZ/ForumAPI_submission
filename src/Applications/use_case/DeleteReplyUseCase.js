class DeleteReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const {
            threadId, commentId, replyId, userId,
        } = useCasePayload;
        await this._threadRepository.verifyThreadExist(threadId);
        await this._commentRepository.verifyCommentExist(threadId, commentId);
        // pindah cover unmatch reply - comment ke sini:
        await this._replyRepository.verifyReplyExist(commentId, replyId);
        // pindah validasi otorisasi ke sini:
        await this._replyRepository.verifyReplyOwner(replyId, userId);
        await this._replyRepository.deleteReply(replyId);
    }
}
module.exports = DeleteReplyUseCase;
