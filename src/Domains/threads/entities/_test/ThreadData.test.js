const ThreadData = require('../ThreadData');

describe('Thread Data entities', () => {
    it('should throw error when payload did not contain needed property', () => {
    // Arrange
        const payload = {
            title: 'abc',
            //   body: 'abc',
        };

        // Action and Assert
        expect(() => new ThreadData(payload)).toThrowError('THREAD_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
    // Arrange
        const payload = {
            body: 'abc',
            title: true,
        };

        // Action and Assert
        expect(() => new ThreadData(payload)).toThrowError('THREAD_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create threadData object correctly', () => {
    // Arrange
        const payload = {
            title: 'title payload',
            body: 'body payload',
        };

        // Action
        const { title, body } = new ThreadData(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});
