const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentData = require('../../../Domains/comments/entities/CommentData');
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

        const mockCommentData = new CommentData({
            thread_id: 'thread-123',
            owner: 'user-123',
            content: 'sebuah komen',
            is_delete: false,
            date: '20 Nov',
            id: 'comment-123',
        });
        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentData));
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
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    });
    it('should throw auth error if person isnt comment owner', async () => {
        // Arrange (entity)
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-123',
            commentId: 'comment-123',
        };

        // unauth case -> unmatch owner data with request credential (di payloadnya)
        const mockCommentData = new CommentData({
            thread_id: 'thread-123',
            owner: 'user-xyz',
            content: 'sebuah komen',
            is_delete: false,
            date: '20 Nov',
            id: 'comment-123',
        });
        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentData));
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // act & assert
        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError(AuthorizationError);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId);
    });
    it('should throw 404 error if request params have threadId that not match with thread_id stored in comments table ', async () => {
        // Arrange (entity)
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-123',
            commentId: 'comment-123',
        };

        // invalid case -> unmatch threadId, tapi comment dengan Id yang dimaksud ada
        const mockCommentData = new CommentData({
            thread_id: 'thread-xyz',
            owner: 'user-123',
            content: 'sebuah komen',
            is_delete: false,
            date: '20 Nov',
            id: 'comment-123',
        });
        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentData));
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // act & assert
        await expect(deleteCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError(NotFoundError);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.getCommentById).toBeCalledWith(useCasePayload.commentId);
    });
});
