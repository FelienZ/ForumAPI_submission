const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyData = require('../../../Domains/replies/entities/ReplyData');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('Add Reply Use Case', () => {
    it('should orchestrating create reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'ini konten',
            userId: 'user-123',
            commentId: 'comment-123',
        };

        const mockReplyData = new ReplyData({
            id: 'reply-123',
            content: useCasePayload.content,
        });

        // depedency
        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.commentId,
                owner: useCasePayload.userId,
                threadId: 'thread-123',
            }));
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: useCasePayload.commentId,
                owner: useCasePayload.userId,
                threadId: 'thread-123',
            }));
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplyData));

        // create use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addReply).toEqual(new ReplyData({
            id: 'reply-123',
            content: useCasePayload.content,
        }));
    });
    it('Should throw Not Found Error if Comment isnt exist', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'ini konten',
            userId: 'user-123',
            commentId: 'comment-123',
        };

        const mockReplyData = new ReplyData({
            id: 'reply-123',
            content: useCasePayload.content,
        });

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
                threadId: 'thread-456',
            }));
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplyData));

        // create use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action & Assert
        await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(NotFoundError);
    });
});
