/* eslint-disable no-underscore-dangle */
const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const threadData = new NewThread(useCasePayload);
        const addedThread = await this._threadRepository.addThread(threadData);
        return addedThread;
    }
}

module.exports = AddThreadUseCase;
