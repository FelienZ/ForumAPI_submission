const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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
        await this._threadRepository.getThreadById(threadId);
        await this._commentRepository.getCommentById(commentId);
        const reply = await this._replyRepository.getReplyById(replyId);
        if (reply.owner !== userId) {
            throw new AuthorizationError('Tidak Berhak menghapus reply');
        }
        await this._replyRepository.deleteReply(replyId);
    }
}
module.exports = DeleteReplyUseCase;
