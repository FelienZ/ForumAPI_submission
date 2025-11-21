const ThreadDetail = require('../ThreadDetail');

describe('Thread Detail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            id: '123',
            title: 'abc',
            body: 'abc',
            // username
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
        };

        // Action
        const {
            id, title, body, username,
        } = new ThreadDetail(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(username).toEqual(payload.username);
    });
});
