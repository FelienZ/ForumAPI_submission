const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('Delete Reply Use Case', () => {
    it('should orchestrating create reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
        };

        // depedency
        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await deleteReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist)
            .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockReplyRepository.verifyReplyExist)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.replyId);
        expect(mockReplyRepository.verifyReplyOwner)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.userId);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });
});
