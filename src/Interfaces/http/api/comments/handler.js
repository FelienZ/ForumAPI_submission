/* eslint-disable no-underscore-dangle */
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentHandler {
    constructor(container) {
        this._container = container;
        this.postCommentHandler = this.postCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const addCommentHandler = this._container.getInstance(AddCommentUseCase.name);
        const { threadId } = request.params;
        const { content } = request.payload;
        const { id: owner } = request.auth.credentials;
        const addedComment = await addCommentHandler.execute({ content, owner, threadId });
        const response = h.response({
            status: 'success',
            data: {
                addedComment: {
                    id: addedComment.id,
                    content: addedComment.content,
                    owner: addedComment.owner,
                },
            },
        });
        response.code(201);
        return response;
    }
}
module.exports = CommentHandler;
