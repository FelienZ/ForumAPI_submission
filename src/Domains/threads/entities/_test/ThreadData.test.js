const ThreadData = require('../ThreadData');

describe('Thread Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        // miss data owner, date
        const payload = {
            id: 'thread-123',
            title: 'abc',
            body: 'abc',
        };

        // Action and Assert
        expect(() => new ThreadData(payload)).toThrowError('THREAD_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        // invalid date type
        const payload = {
            body: 'abc',
            title: 'sebuah thread',
            id: 'thread-123',
            owner: 'user-123',
            date: 123,
        };

        // Action and Assert
        expect(() => new ThreadData(payload)).toThrowError('THREAD_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create threadData object correctly', () => {
    // Arrange
        const payload = {
            body: 'abc',
            title: 'sebuah thread',
            id: 'thread-123',
            owner: 'user-123',
            date: '20 November 2025',
        };

        // Action
        const {
            title, body, id, owner, date,
        } = new ThreadData(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(id).toEqual(payload.id);
        expect(owner).toEqual(payload.owner);
        expect(date).toEqual(payload.date);
    });
});
