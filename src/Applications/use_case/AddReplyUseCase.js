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
        // ubah validasi match thread <-> comment ke sini:
        await this._commentRepository.verifyCommentExist(threadId, commentId);
        const replyData = new NewReply(useCasePayload);
        const addedReply = await this._replyRepository.addReply(replyData);
        return addedReply;
    }
}
module.exports = AddReplyUseCase;
