/* eslint-disable camelcase */
class ReplyData {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, content, date, owner, comment_id: commentId, is_delete: isDelete,
        } = payload;
        this.id = id;
        this.content = content;
        this.commentId = commentId;
        this.isDelete = isDelete;
        this.date = date;
        this.owner = owner;
    }

    _verifyPayload({
        id, content, comment_id, is_delete, date, owner,
    }) {
        if (!content || !id || !comment_id || !date || !owner) {
            throw new Error('REPLY_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof content !== 'string' || typeof id !== 'string' || typeof comment_id !== 'string' || typeof is_delete !== 'boolean' || !(typeof date === 'object' || typeof date === 'string') || typeof owner !== 'string') {
            throw new Error('REPLY_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}
module.exports = ReplyData;
