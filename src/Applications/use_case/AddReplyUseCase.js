const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId } = useCasePayload;
        await this._threadRepository.verifyThreadExist(threadId);
        await this._commentRepository.verifyCommentExist(commentId);
        const comment = await this._commentRepository.getCommentById(commentId);
        // validasi tujuan request -> match thread & commentnya
        if (comment.threadId !== threadId) {
            throw new NotFoundError('comment tidak ditemukan pada thread');
        }
        const replyData = new NewReply(useCasePayload);
        const addedReply = await this._replyRepository.addReply(replyData);
        return addedReply;
    }
}
module.exports = AddReplyUseCase;
