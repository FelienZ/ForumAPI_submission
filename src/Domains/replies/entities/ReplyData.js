class ReplyData {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, content, date, owner, commentId, isDelete,
        } = payload;
        this.id = id;
        this.content = content;
        this.commentId = commentId;
        this.isDelete = isDelete;
        this.date = date;
        this.owner = owner;
    }

    _verifyPayload({ content }) {
        if (!content) {
            throw new Error('REPLY_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof content !== 'string') {
            throw new Error('REPLY_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}
module.exports = ReplyData;
