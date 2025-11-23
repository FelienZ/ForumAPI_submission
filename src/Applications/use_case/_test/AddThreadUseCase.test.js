const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadData = require('../../../Domains/threads/entities/ThreadData');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('Add Thread Use Case', () => {
    it('should orchestrating create thread action correctly', async () => {
        // Arrange (entity)
        const useCasePayload = {
            title: 'ini thread',
            body: 'body thread',
            owner: 'user-123',
        };

        const mockAddedThread = new ThreadData({
            ...useCasePayload,
            id: 'thread-123',
            date: '20 Nov',
        });

        // depedency
        const mockThreadRepository = new ThreadRepository();

        // mock method used
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        // create use case instance
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(new ThreadData({
            owner: useCasePayload.owner,
            title: useCasePayload.title,
            body: useCasePayload.body,
            id: 'thread-123',
            date: '20 Nov',
        }));

        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
            owner: useCasePayload.owner,
            title: useCasePayload.title,
            body: useCasePayload.body,
        }));
    });
});
