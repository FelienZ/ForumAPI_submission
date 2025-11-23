const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('Get Thread Detail Use Case', () => {
    it('should orchestrating Get thread detail action correctly', async () => {
        // Arrange
        const mockThreadData = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'body thread',
            username: 'userX',
            date: '20 November',
        };
        // comments dalam array (via getByThreadId) -> misal komen dihapus
        const mockCommentData = [{
            id: 'comment-123',
            content: 'sebuah komen',
            is_delete: true,
            username: 'userY',
            date: '20 November',
        }];
        // reply dalam array (via getByCommentId) -> misal balasan dihapus juga
        const mockReplyData = [{
            id: 'reply-123',
            content: 'sebuah balasan komen',
            is_delete: true,
            date: '20 November',
            username: 'userZ',
        }];

        // depedency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        // mock method used
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadData));
        // kedua ini return result.rows (arr)
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
            .execute(mockThreadData.id);
        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadData.id);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadData.id);
        expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(mockCommentData[0].id);
        expect(getThreadDetail).toEqual({
            id: mockThreadData.id,
            title: 'sebuah thread',
            body: 'body thread',
            username: 'userX',
            date: '20 November',
            comments: [
                {
                    id: 'comment-123',
                    content: '**komentar telah dihapus**',
                    username: 'userY',
                    is_delete: true,
                    date: '20 November',
                    replies: [
                        {
                            id: 'reply-123',
                            content: '**balasan telah dihapus**',
                            username: 'userZ',
                            is_delete: true,
                            date: '20 November',
                        },
                    ],
                },
            ],
        });
    });
});
