const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
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
            const newThread = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await repo.addThread(newThread);

            // Assert
            const thread = await ThreadTableTestHelper.findThreadsById('thread-123');
            expect(thread).toHaveLength(1);
            expect(thread[0]).toStrictEqual({
                owner: 'user-123',
                id: 'thread-123',
                title: 'judul',
                body: 'isi',
                date: thread[0].date,
            });
        });
    });

    describe('verifyThreadExist', () => {
        it('should return 404 if thread isnt exist', async () => {
            // Arrange
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(repo.verifyThreadExist('thread-123')).rejects.toThrowError(NotFoundError);
        });

        it('shouldnt throw 404 if thread exist', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            const newThread = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await repo.addThread(newThread);
            await expect(repo.verifyThreadExist('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('getThreadById', () => {
        it('should return Thread Data when thread exists', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ id: 'user-321', username: 'bob' });
            const fakeIdGenerator = () => '321';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await repo.addThread({
                title: 'ini title thread', body: 'ini body', owner: 'user-321',
            });

            // Assert
            const thread = await ThreadTableTestHelper.findThreadsById('thread-321');
            expect(thread[0]).toStrictEqual({
                owner: 'user-321',
                id: 'thread-321',
                title: 'ini title thread',
                body: 'ini body',
                date: thread[0].date,
            });
        });
    });
});
