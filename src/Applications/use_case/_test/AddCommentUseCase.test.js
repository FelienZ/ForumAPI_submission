const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentData = require('../../../Domains/comments/entities/CommentData');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('Add Comment Use Case', () => {
    it('should orchestrating create comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'sebuah komen',
            owner: 'user-123',
            threadId: 'thread-123',
        };

        const mockAddedComment = new CommentData({
            id: 'comment-123',
            content: 'sebuah komen',
            thread_id: 'thread-123',
            is_delete: false,
            owner: 'user-123',
            date: '20 November',
        });

        // depedency
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        // create use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(new CommentData({
            id: 'comment-123',
            is_delete: false,
            date: '20 November',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            thread_id: useCasePayload.threadId,
        }));
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            threadId: useCasePayload.threadId,
        }));
    });
});
