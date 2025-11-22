const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadData = require('../../Domains/threads/entities/ThreadData');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(threadData) {
        const { title, body, owner } = threadData;
        const id = `thread-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING *',
            values: [id, title, body, owner],
        };
        const result = await this._pool.query(query);
        return new ThreadData({ ...result.rows[0] });
    }

    async verifyThreadExist(threadId) {
        const query = {
            text: 'SELECT id FROM threads where id = $1',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t JOIN users u ON t.owner = u.id WHERE t.id = $1',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        // pindah logic mapping ke use case getDetail
        return new ThreadDetail({ ...result.rows[0] });
    }
}

module.exports = ThreadRepositoryPostgres;
