class ThreadData {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, title, body, date, owner,
        } = payload;
        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.owner = owner;
    }

    _verifyPayload({ title, body }) {
        if (!title || !body) {
            throw new Error('THREAD_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('THREAD_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadData;
