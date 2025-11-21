/* eslint-disable no-underscore-dangle */
const ThreadData = require('../../Domains/threads/entities/ThreadData');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const threadData = new ThreadData(useCasePayload);
        const addedThread = await this._threadRepository.addThread(threadData);
        return addedThread;
    }
}

module.exports = AddThreadUseCase;
