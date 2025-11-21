const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, userId } = useCasePayload;
        await this._threadRepository.getThreadById(threadId);
        const comment = await this._commentRepository.getCommentById(commentId);
        if (comment.owner !== userId) {
            throw new AuthorizationError('tidak berhak menghapus comment');
        }
        await this._commentRepository.deleteComment(commentId);
    }
}
module.exports = DeleteCommentUseCase;
