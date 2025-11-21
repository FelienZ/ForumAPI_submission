const ThreadData = require('../../../Domains/threads/entities/ThreadData');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('Add Thread Use Case', () => {
    it('should orchestrating create thread action correctly', async () => {
        // Arrange (entity)
        const useCasePayload = {
            title: 'ini thread',
            body: 'body thread',
        };

        const mockThreadData = new ThreadData({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
        });

        // depedency
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadData));

        // create use case instance
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addThread).toEqual(new ThreadData({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
        }));
        expect(mockThreadRepository.addThread).toBeCalledWith(new ThreadData({
            title: useCasePayload.title,
            body: useCasePayload.body,
        }));
    });
});
