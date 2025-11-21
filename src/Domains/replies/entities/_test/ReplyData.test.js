const ReplyData = require('../ReplyData');

describe('Reply Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            // content
        };

        // Action and Assert
        expect(() => new ReplyData(payload)).toThrowError('REPLY_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            content: 123,
        };

        // Action and Assert
        expect(() => new ReplyData(payload)).toThrowError('REPLY_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Reply Data object correctly', () => {
    // Arrange
        const payload = {
            content: 'ini content',
        };

        // Action
        const { content } = new ReplyData(payload);

        // Assert
        expect(content).toEqual(payload.content);
    });
});
