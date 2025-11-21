/* eslint-disable no-underscore-dangle */
const CommentData = require('../../Domains/comments/entities/CommentData');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload;
        await this._threadRepository.getThreadById(threadId);
        const commentData = new CommentData(useCasePayload);
        const addedComment = await this._commentRepository.addComment(commentData);
        return addedComment;
    }
}

module.exports = AddCommentUseCase;
