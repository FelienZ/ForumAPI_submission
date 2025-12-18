/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
class GetThreadDetailUseCase {
    constructor({
        threadRepository, commentRepository, replyRepository, commentLikeRepository,
    }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._commentLikesRepository = commentLikeRepository;
    }

    async execute(useCasePayload) {
        const thread = await this._threadRepository.getThreadById(useCasePayload);
        const rawComments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
        // ini mapping data yang dihapus buat ubah tampilan content
        const commentData = rawComments
            .map((c) => (c.is_delete ? { ...c, content: '**komentar telah dihapus**' } : c));
        // concat data reply ke comments
        for (const comment of commentData) {
            comment.replies = await this._replyRepository.getRepliesByCommentId(comment.id);
            comment.likeCount = await this._commentLikesRepository
                .getLikesCountByCommentId(comment.id) ?? 0;
        }
        // mapping buat content reply berdasar status is_delete
        const comments = commentData.map((c) => {
            const replies = c.replies
                .map((r) => (r.is_delete ? { ...r, content: '**balasan telah dihapus**' } : r));
            return { ...c, replies };
        });
        return { ...thread, comments };
    }
}
module.exports = GetThreadDetailUseCase;
