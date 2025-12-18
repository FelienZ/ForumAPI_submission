const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

class CommmentLikeHandler {
    constructor(container) {
        this._container = container;
        this.postLikeHandler = this.postLikeHandler.bind(this);
    }

    async postLikeHandler(request, h) {
        const toggleCommentLikeHandler = this._container.getInstance(ToggleCommentLikeUseCase.name);
        const { threadId, commentId } = request.params;
        const { id: userId } = request.auth.credentials;
        await toggleCommentLikeHandler.execute({
            threadId, commentId, userId,
        });
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = CommmentLikeHandler;
