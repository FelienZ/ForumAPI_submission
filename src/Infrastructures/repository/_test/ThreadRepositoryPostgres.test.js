const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadData = require('../../../Domains/threads/entities/ThreadData');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('Thread Repository Postgres', () => {
    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable();
        await UserTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });

    describe('addThread', () => {
        it('should persist thread and return ThreadData correctly', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            const threadData = new ThreadData({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await repo.addThread(threadData);

            // Assert
            const thread = await ThreadTableTestHelper.findThreadsById('thread-123');
            expect(thread).toHaveLength(1);
            expect(addedThread).toBeInstanceOf(ThreadData);
            expect(addedThread.id).toEqual('thread-123');
            expect(addedThread.title).toEqual('judul');
            expect(addedThread.owner).toEqual('user-123');
        });
    });

    describe('getThreadById', () => {
        it('should return ThreadDetail when thread exists', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ id: 'user-321', username: 'bob' });
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await ThreadTableTestHelper.addThread({
                id: 'thread-321', title: 'ini title thread', body: 'ini body', owner: 'user-321',
            });

            // Assert
            const thread = await repo.getThreadById('thread-321');
            expect(thread).toBeInstanceOf(ThreadDetail);
            expect(thread.id).toEqual('thread-321');
            expect(thread.title).toEqual('ini title thread');
            expect(thread.body).toEqual('ini body');
            expect(thread.username).toEqual('bob');
        });

        it('should throw NotFoundError if thread does not exist', async () => {
            // Arrange
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(repo.getThreadById('thread-not-exist')).rejects.toThrow(NotFoundError);
        });
    });
});
