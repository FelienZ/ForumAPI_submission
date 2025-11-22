const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload;
        await this._threadRepository.verifyThreadExist(threadId);
        // pisahkan model newcomment sama commentdata
        const commentData = new NewComment(useCasePayload);
        const addedComment = await this._commentRepository.addComment(commentData);
        return addedComment;
    }
}

module.exports = AddCommentUseCase;
