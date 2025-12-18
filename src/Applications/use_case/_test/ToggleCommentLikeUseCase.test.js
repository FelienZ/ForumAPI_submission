const CommentLikesRepository = require('../../../Domains/commentlikes/CommentLikesRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');

describe('Add Like in Comment Use Case', () => {
    it('should orchestrating post like comment action correctly', async () => {
        // Arrange
        const data = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };
        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeCommentRepository = new CommentLikesRepository();

        // mock method used
        mockThreadRepository.verifyThreadExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn()
            .mockImplementation(() => Promise.resolve());
        // casenya isLiked = true, maka togglenya delete
        mockLikeCommentRepository.isLiked = jest.fn()
            .mockImplementation(() => Promise.resolve(true));
        mockLikeCommentRepository.addLike = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockLikeCommentRepository.deleteLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        // create use case instance
        const toggleCommentLike = new ToggleCommentLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentLikeRepository: mockLikeCommentRepository,
        });

        // action
        await toggleCommentLike.execute(data);

        // assert
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(data.threadId);
        expect(mockCommentRepository.verifyCommentExist)
            .toBeCalledWith(data.threadId, data.commentId);
        expect(mockLikeCommentRepository.isLiked)
            .toBeCalledWith(data.commentId, data.userId);
        // karena return isLiked = true, maka addLike nggak ditoggle (case fail, set called)
        expect(mockLikeCommentRepository.addLike)
            .toBeCalledWith(data.commentId, data.userId);
        expect(mockLikeCommentRepository.deleteLike)
            .toBeCalledWith(data.commentId, data.userId);
    });
});
