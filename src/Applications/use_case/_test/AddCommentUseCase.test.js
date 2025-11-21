const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentData = require('../../../Domains/comments/entities/CommentData');
const ThreadData = require('../../../Domains/threads/entities/ThreadData');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('Add Comment Use Case', () => {
    it('should orchestrating create comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'ini konten',
        };

        const mockCommentData = new CommentData({
            id: 'comment-123',
            content: useCasePayload.content,
        });

        const mockThreadData = new ThreadData({
            id: 'thread-123',
            title: 'ini thread',
            body: 'body thread',
        });

        // depedency
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentData));
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadData));

        // create use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addComment).toEqual(new CommentData({
            id: 'comment-123',
            content: useCasePayload.content,
        }));
        expect(mockCommentRepository.addComment).toBeCalledWith(new CommentData({
            content: useCasePayload.content,
        }));
    });
});
