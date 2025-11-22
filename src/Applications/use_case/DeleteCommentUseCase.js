const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, userId } = useCasePayload;
        await this._threadRepository.verifyThreadExist(threadId);
        await this._commentRepository.verifyCommentExist(commentId);
        const comment = await this._commentRepository.getCommentById(commentId);
        if (comment.owner !== userId) {
            throw new AuthorizationError('tidak berhak menghapus comment');
        }
        // cover jika comment id sesuai, tapi punya thread id yang unmatch
        if (comment.threadId !== threadId) {
            throw new NotFoundError('comment tidak ditemukan pada thread');
        }
        await this._commentRepository.deleteComment(commentId);
    }
}
module.exports = DeleteCommentUseCase;
