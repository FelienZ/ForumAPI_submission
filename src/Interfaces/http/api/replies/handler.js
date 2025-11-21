const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
    constructor(container) {
        this._container = container;
        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const addReplyHandler = this._container.getInstance(AddReplyUseCase.name);
        const { threadId } = request.params;
        const { commentId } = request.params;
        const { content } = request.payload;
        const { id: owner } = request.auth.credentials;
        const addedReply = await addReplyHandler.execute({
            content, owner, threadId, commentId,
        });
        const response = h.response({
            status: 'success',
            data: {
                addedReply: {
                    id: addedReply.id,
                    content: addedReply.content,
                    owner: addedReply.owner,
                },
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const { threadId } = request.params;
        const { commentId } = request.params;
        const { replyId } = request.params;
        const { id: userId } = request.auth.credentials;
        const deleteReplyHandler = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyHandler.execute({
            threadId, commentId, userId, replyId,
        });
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}
module.exports = ReplyHandler;
