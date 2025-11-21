const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('Delete Reply Use Case', () => {
    it('should orchestrating create reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'ini konten',
            userId: 'user-x',
            commentId: 'comment-123',
            replyId: 'reply-123',
        };

        // depedency
        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.threadId,
                title: 'ini thread',
                body: 'body thread',
            }));
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.commentId,
                owner: useCasePayload.userId,
                threadId: 'thread-123',
            }));
        mockReplyRepository.getReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.replyId,
                owner: useCasePayload.userId,
            }));
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.replyId));

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await deleteReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.getReplyById).toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });
    it('Should throw Authorization Error if UserId not match with owner Data', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'ini konten',
            userId: 'user-x',
            commentId: 'comment-123',
            replyId: 'reply-123',
        };

        // depedency
        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.commentId,
                owner: useCasePayload.userId,
                threadId: 'thread-123',
            }));
        mockReplyRepository.getReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.replyId,
                owner: 'user-unauth',
            }));
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve(useCasePayload.replyId));

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(deleteReplyUseCase
            .execute(useCasePayload)).rejects.toThrowError(AuthorizationError);
    });
});
