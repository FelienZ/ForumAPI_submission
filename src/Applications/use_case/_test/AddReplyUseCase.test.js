const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentData = require('../../../Domains/comments/entities/CommentData');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyData = require('../../../Domains/replies/entities/ReplyData');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('Add Reply Use Case', () => {
    it('should orchestrating create reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'sebuah balasan komen',
            owner: 'user-123',
            commentId: 'comment-123',
        };

        const mockAddedReply = new ReplyData({
            id: 'reply-123',
            content: useCasePayload.content,
            is_delete: false,
            date: '20 Nov',
            comment_id: useCasePayload.commentId,
            owner: useCasePayload.owner,
        });

        // untuk representasi data komen via getById
        const mockCommentData = new CommentData({
            id: 'comment-123',
            content: 'sebuah komen',
            thread_id: 'thread-123',
            is_delete: false,
            owner: 'user-123',
            date: '20 November',
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
        mockCommentRepository.getCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentData));
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedReply));

        // create use case instance
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(new ReplyData({
            ...useCasePayload,
            id: 'reply-123',
            is_delete: false,
            date: '20 Nov',
            comment_id: useCasePayload.commentId,
        }));
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentExist)
            .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            threadId: useCasePayload.threadId,
            commentId: useCasePayload.commentId,
        }));
    });
});
