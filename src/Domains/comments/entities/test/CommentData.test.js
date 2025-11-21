const CommentData = require('../CommentData');

describe('Comment Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            // content
        };

        // Action and Assert
        expect(() => new CommentData(payload)).toThrowError('COMMENT_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            content: 123,
        };

        // Action and Assert
        expect(() => new CommentData(payload)).toThrowError('COMMENT_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create commentData object correctly', () => {
    // Arrange
        const payload = {
            content: 'ini content',
        };

        // Action
        const { content } = new CommentData(payload);

        // Assert
        expect(content).toEqual(payload.content);
    });
});
