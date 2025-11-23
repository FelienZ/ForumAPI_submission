const NewThread = require('../NewThread');

describe('New Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            title: 'abc',
            //   body: 'abc',
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            body: 'abc',
            title: true,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create new thread object correctly', () => {
    // Arrange
        const payload = {
            title: 'title payload',
            body: 'body payload',
            owner: 'user-123',
        };

        // Action
        const { title, body, owner } = new NewThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});
