const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyData = require('../../Domains/replies/entities/ReplyData');

class AddReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId } = useCasePayload;
        await this._threadRepository.getThreadById(threadId);
        const comment = await this._commentRepository.getCommentById(commentId);
        if (comment.threadId !== threadId) {
            throw new NotFoundError('comment tidak ditemukan pada thread');
        }
        const replyData = new ReplyData(useCasePayload);
        const addedReply = await this._replyRepository.addReply(replyData);
        return addedReply;
    }
}
module.exports = AddReplyUseCase;
