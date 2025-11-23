const ThreadDetail = require('../ThreadDetail');

describe('Thread Detail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        // miss username, date
        const payload = {
            id: '123',
            title: 'abc',
            body: 'abc',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            id: 123,
            body: 'abc',
            title: 'abc',
            username: 'abc',
            date: 2025,
        };

        // Action and Assert
        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create registerUser object correctly', () => {
    // Arrange
        const payload = {
            id: '123',
            title: 'title payload',
            body: 'body payload',
            username: 'username payload',
            date: '20 November 2025',
        };

        // Action
        const {
            id, title, body, username, date,
        } = new ThreadDetail(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(date).toEqual(payload.date);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(username).toEqual(payload.username);
    });
});
