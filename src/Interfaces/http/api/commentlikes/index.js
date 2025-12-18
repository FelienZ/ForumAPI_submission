const CommentLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'commentLikes',
    register: async (server, { container }) => {
        const likeCommentHandler = new CommentLikeHandler(container);
        server.route(routes(likeCommentHandler));
    },
};
