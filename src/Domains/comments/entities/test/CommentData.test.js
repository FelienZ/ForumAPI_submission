/* eslint-disable camelcase */
const CommentData = require('../CommentData');

describe('Comment Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        // miss prop isDelete, date
        const payload = {
            id: 'comment-123',
            content: 'ini konten',
            thread_id: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CommentData(payload)).toThrowError('COMMENT_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            id: 'comment-123',
            thread_id: 'thread-123',
            owner: 'user-123',
            content: 123,
            is_delete: 'true',
            date: 2025,
        };

        // Action and Assert
        expect(() => new CommentData(payload)).toThrowError('COMMENT_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create commentData object correctly', () => {
    // Arrange
        const payload = {
            id: 'comment-123',
            thread_id: 'thread-123',
            owner: 'user-123',
            content: 'ini content',
            is_delete: true,
            date: '2025',
        };

        // Action
        // sesuaikan bentuk instance sama struktur entity
        const {
            id, threadId, owner, content, isDelete, date,
        } = new CommentData(payload);
        // console.log('cek threadId: ', threadId);

        // Assert
        expect(content).toEqual(payload.content);
        expect(id).toEqual(payload.id);
        expect(threadId).toEqual(payload.thread_id);
        expect(owner).toEqual(payload.owner);
        expect(isDelete).toEqual(payload.is_delete);
        expect(date).toEqual(payload.date);
    });
});
