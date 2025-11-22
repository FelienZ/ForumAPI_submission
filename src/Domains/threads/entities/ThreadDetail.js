// hasil join owner -> username
class ThreadDetail {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, title, body, date, username,
        } = payload;
        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.username = username;
    }

    _verifyPayload({
        id, title, body, username, date,
    }) {
        if (!id || !title || !body || !username || !date) {
            throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string' || !(typeof date === 'object' || typeof date === 'string')) {
            throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}
module.exports = ThreadDetail;
