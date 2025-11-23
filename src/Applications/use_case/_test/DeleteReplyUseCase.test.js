const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyData = require('../../../Domains/replies/entities/ReplyData');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('Delete Reply Use Case', () => {
    it('should orchestrating create reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
        };

        const mockReplyData = new ReplyData({
            comment_id: 'comment-123',
            owner: 'user-123',
            content: 'sebuah komen',
            is_delete: false,
            date: '20 Nov',
            id: 'comment-123',
        });

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
        mockReplyRepository.getReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplyData));
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
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.getReplyById).toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
    });
    it('Should throw Authorization Error if UserId not match with owner Data', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-x',
            commentId: 'comment-123',
            replyId: 'reply-123',
        };

        /* invalid case -> unauth person, misal request credsnya
        punya id user-x tapi ownernya user-123 */

        const mockReplyData = new ReplyData({
            comment_id: 'comment-123',
            owner: 'user-123',
            content: 'sebuah komen',
            is_delete: false,
            date: '20 Nov',
            id: 'comment-123',
        });

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
        mockReplyRepository.getReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplyData));
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(deleteReplyUseCase
            .execute(useCasePayload)).rejects.toThrowError(AuthorizationError);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.getReplyById).toBeCalledWith(useCasePayload.replyId);
    });
    it('Should throw 404 Error if commentId not match with reply.commentId', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            userId: 'user-123',
            commentId: 'comment-x',
            replyId: 'reply-123',
        };

        /* invalid case -> invalid target, misal request params
        punya id comment comment-x untuk reply dengan id yang sama,
        tapi di table reply punya id comment comment-123 */

        const mockReplyData = new ReplyData({
            comment_id: 'comment-123',
            owner: 'user-123',
            content: 'sebuah komen',
            is_delete: false,
            date: '20 Nov',
            id: 'comment-123',
        });

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
        mockReplyRepository.getReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplyData));
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(deleteReplyUseCase
            .execute(useCasePayload)).rejects.toThrowError(NotFoundError);
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.getReplyById).toBeCalledWith(useCasePayload.replyId);
    });
});
