/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const thread = await this._threadRepository.getThreadById(useCasePayload);
        const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
        for (const comment of comments) {
            comment.replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        }
        return { ...thread, comments };
    }
}
module.exports = GetThreadDetailUseCase;
