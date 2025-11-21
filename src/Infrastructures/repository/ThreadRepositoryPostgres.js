/* eslint-disable no-underscore-dangle */
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
        // mapping db ke model
        return new ThreadData({
            id: result.rows[0].id,
            title: result.rows[0].title,
            date: result.rows[0].date,
            owner: result.rows[0].owner,
            body: result.rows[0].body,
        });
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t JOIN users u ON t.owner = u.id WHERE t.id = $1',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }
        return new ThreadDetail({
            id: result.rows[0].id,
            title: result.rows[0].title,
            date: result.rows[0].date,
            username: result.rows[0].username,
            body: result.rows[0].body,
            comments: result.rows[0].comments,
        });
    }
}

module.exports = ThreadRepositoryPostgres;
