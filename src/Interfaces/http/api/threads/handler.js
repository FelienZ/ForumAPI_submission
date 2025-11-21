/* eslint-disable no-underscore-dangle */
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
        this.deleteCommentInThreadHandler = this.deleteCommentInThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadHandler = this._container.getInstance(AddThreadUseCase.name);
        const { title, body } = request.payload;
        const { id: owner } = request.auth.credentials;
        const addedThread = await addThreadHandler.execute({ title, body, owner });
        const response = h.response({
            status: 'success',
            data: {
                addedThread: {
                    id: addedThread.id,
                    title: addedThread.title,
                    owner: addedThread.owner,
                },
            },
        });
        response.code(201);
        return response;
    }

    async getThreadByIdHandler(request, h) {
        const { threadId } = request.params;
        const getThreadHandler = this._container.getInstance(GetThreadDetailUseCase.name);
        const thread = await getThreadHandler.execute(threadId);
        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        response.code(200);
        return response;
    }

    async deleteCommentInThreadHandler(request, h) {
        const { threadId } = request.params;
        const { commentId } = request.params;
        const { id: userId } = request.auth.credentials;
        const deleteCommentHandler = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentHandler.execute({ threadId, commentId, userId });
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;
