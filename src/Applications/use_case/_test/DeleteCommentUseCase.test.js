const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
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
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({ id: useCasePayload.commentId, owner: 'user-123' }));
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.commentId));

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);

        // negative case: unauth
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({ id: useCasePayload.commentId, owner: 'user-xyz' }));
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.commentId));
        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects.toThrow(AuthorizationError);
    });
});
