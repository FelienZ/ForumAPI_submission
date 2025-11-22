// untuk show data comment
/* eslint-disable camelcase */
class CommentData {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, content, date, thread_id: threadId, is_delete: isDelete, owner,
        } = payload;
        this.id = id;
        this.content = content;
        this.threadId = threadId;
        this.isDelete = isDelete;
        this.date = date;
        this.owner = owner;
    }

    _verifyPayload({
        id, content, thread_id, is_delete, date, owner,
    }) {
        if (!content || !id || !thread_id || !date || !owner) {
            throw new Error('COMMENT_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof id !== 'string' || typeof thread_id !== 'string' || typeof is_delete !== 'boolean' || typeof owner !== 'string' || !(typeof date === 'object' || typeof date === 'string')) {
            throw new Error('COMMENT_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}
module.exports = CommentData;
