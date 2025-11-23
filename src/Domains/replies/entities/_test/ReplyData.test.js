const ReplyData = require('../ReplyData');

describe('Reply Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        // miss data date, isDelete
        const payload = {
            id: 'reply-123',
            content: '123',
            comment_id: 'comment-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new ReplyData(payload)).toThrowError('REPLY_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            id: 'reply-123',
            comment_id: 'comment-123',
            owner: 'user-123',
            content: 123,
            is_delete: 'true',
            date: 2025,
        };

        // Action and Assert
        expect(() => new ReplyData(payload)).toThrowError('REPLY_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Reply Data object correctly', () => {
    // Arrange
        const payload = {
            id: 'reply-123',
            comment_id: 'comment-123',
            owner: 'user-123',
            content: '123',
            is_delete: true,
            date: '2025',
        };

        // Action
        const {
            content, id, commentId, owner, isDelete, date,
        } = new ReplyData(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(id).toEqual(payload.id);
        expect(commentId).toEqual(payload.comment_id);
        expect(owner).toEqual(payload.owner);
        expect(isDelete).toEqual(payload.is_delete);
        expect(date).toEqual(payload.date);
    });
});
