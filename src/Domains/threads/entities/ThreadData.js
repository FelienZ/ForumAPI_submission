// thread data buat return hasil add (sebelum join via getById)
class ThreadData {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, title, body, owner, date,
        } = payload;
        this.id = id;
        this.title = title;
        this.body = body;
        this.owner = owner;
        this.date = date;
    }

    _verifyPayload({
        id, title, body, owner, date,
    }) {
        if (!id || !title || !body || !owner || !date) {
            throw new Error('THREAD_DATA.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        // allow type string/object untuk date
        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string' || !(typeof date === 'object' || typeof date === 'string')) {
            throw new Error('THREAD_DATA.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadData;
