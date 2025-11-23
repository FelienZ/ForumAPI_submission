const NewReply = require('../NewReply');

describe('New Reply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        // miss threadId, owner, comment
        const payload = {
            content: 'ini Komen',
        };

        // Action and Assert
        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            threadId: 'thread-123',
            content: 123,
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Reply Data object correctly', () => {
    // Arrange
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
            content: 'ini content',
        };

        // Action
        const {
            content, threadId, commentId, owner,
        } = new NewReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(commentId).toEqual(payload.commentId);
        expect(owner).toEqual(payload.owner);
    });
});
