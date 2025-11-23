const NewComment = require('../NewComment');

describe('Comment Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        // miss prop content
        const payload = {
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            threadId: 'thread-123',
            owner: 'user-123',
            content: 123,
        };

        // Action and Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create New Comment object correctly', () => {
    // Arrange
        const payload = {
            threadId: 'thread-123',
            owner: 'user-123',
            content: 'ini content',
        };

        // Action
        const { threadId, owner, content } = new NewComment(payload);

        // Assert
        expect(threadId).toEqual(payload.threadId);
        expect(owner).toEqual(payload.owner);
        expect(content).toEqual(payload.content);
    });
});
