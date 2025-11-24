const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadData = require('../../../Domains/threads/entities/ThreadData');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

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

            // Action & Assert
            const addedThread = await repo.addThread(newThread);
            const findthread = await ThreadTableTestHelper.findThreadsById('thread-123');
            // kembalian addThread Repo -> Thread Data instance
            expect(addedThread).toStrictEqual(new ThreadData({
                owner: 'user-123',
                id: 'thread-123',
                title: 'judul',
                body: 'isi',
                date: addedThread.date,
            }));
            // kembalian findHelper
            expect(findthread).toHaveLength(1);
            expect(findthread[0]).toStrictEqual({
                owner: 'user-123',
                id: 'thread-123',
                title: 'judul',
                body: 'isi',
                date: findthread[0].date,
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
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            // ubah jangan pakai repo asli kalau bukan uji yang terkait
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });
            await expect(repo.verifyThreadExist('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('getThreadById', () => {
        it('should return Thread Data when thread exists', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ id: 'user-321', username: 'bob' });
            const fakeIdGenerator = () => '123';
            const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'ini title thread', body: 'ini body', owner: 'user-321',
            });

            // Assert
            // kembalian getById -> instance detail (hasil join owner -> username)
            const getThread = await repo.getThreadById('thread-123');
            expect(getThread.date).toBeDefined();
            expect(getThread).toStrictEqual(new ThreadDetail({
                username: 'bob',
                id: 'thread-123',
                title: 'ini title thread',
                body: 'ini body',
                date: getThread.date,
            }));
            // kembalian helper
            const findthread = await ThreadTableTestHelper.findThreadsById('thread-123');
            expect(findthread[0].date).toBeDefined();
            expect(findthread[0]).toStrictEqual({
                owner: 'user-321',
                id: 'thread-123',
                title: 'ini title thread',
                body: 'ini body',
                date: findthread[0].date,
            });
        });
    });
});
