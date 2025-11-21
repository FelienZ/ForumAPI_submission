const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('Get Thread Detail Use Case', () => {
    it('should orchestrating Get thread detail action correctly', async () => {
        // Arrange
        const threadId = 'thread-123';
        const mockThreadData = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'body thread',
            username: 'userX',
        };
        // comments dalam array
        const mockCommentData = [{
            id: 'comment-123',
            content: 'ini comment',
            username: 'userY',
        }];
        // comments dalam array
        const mockReplyData = [{
            id: 'reply-123',
            content: 'ini balasan',
            username: 'userZ',
        }];
        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        // mock method used
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadData));
        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockCommentData));
        mockReplyRepository.getRepliesByCommentId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockReplyData));

        // create use case instance
        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const getThreadDetail = await getThreadDetailUseCase
            .execute(threadId);
        // Assert
        expect(getThreadDetail).toEqual({
            id: threadId,
            title: 'sebuah thread',
            body: 'body thread',
            username: 'userX',
            comments: [
                {
                    id: 'comment-123',
                    content: 'ini comment',
                    username: 'userY',
                    replies: [
                        {
                            id: 'reply-123',
                            content: 'ini balasan',
                            username: 'userZ',
                        },
                    ],
                },
            ],
        });
    });
});
