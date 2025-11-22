const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

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
        await this._commentRepository.verifyCommentExist(commentId);
        await this._replyRepository.verifyReplyExist(replyId);
        const reply = await this._replyRepository.getReplyById(replyId);
        if (reply.owner !== userId) {
            throw new AuthorizationError('Tidak Berhak menghapus reply');
        }
        // cover unmatch reply -> comment
        if (reply.commentId !== commentId) {
            throw new NotFoundError('reply tidak ditemukan pada comment');
        }
        await this._replyRepository.deleteReply(replyId);
    }
}
module.exports = DeleteReplyUseCase;
