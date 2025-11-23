const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('Delete Comment in Thread Use Case', () => {
    it('should orchestrating delete comment in thread action correctly', async () => {
        // Arrange (entity)
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-123',
            commentId: 'comment-123',
        };

        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist)
            .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    });
});
