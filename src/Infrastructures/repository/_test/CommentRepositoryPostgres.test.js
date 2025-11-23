const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('Comment Repository Postgres', () => {
    afterEach(async () => {
        await CommentTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });
    describe('addComment', () => {
        it('should persist comment and return CommentData correctly via getById', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);

            // Assert
            const comment = await CommentTableTestHelper.findCommentById('comment-123');
            expect(comment).toStrictEqual({
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                id: 'comment-123',
                date: comment.date,
                is_delete: comment.is_delete,
            });
        });
    });
    describe('getCommentsByThreadId', () => {
        it('should return Comment Data if Thread is exist', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await commentRepo.addComment(commentData);
            const comment = await CommentTableTestHelper.findCommentByThreadId('thread-123');
            expect(comment[0]).toStrictEqual({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                date: comment[0].date,
                is_delete: comment[0].is_delete,
            });
        });
    });
    describe('getCommentById', () => {
        it('Should return Comment Data if Comment Exist', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await commentRepo.addComment(commentData);
            const comment = await CommentTableTestHelper.findCommentById('comment-123');
            expect(comment).toStrictEqual({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                date: comment.date,
                is_delete: comment.is_delete,
            });
        });
    });
    describe('deleteComment', () => {
        it('should delete match comment', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & assert
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await commentRepo.deleteComment('comment-123');
            const result = await CommentTableTestHelper.findCommentById('comment-123');
            expect(result.is_delete).toEqual(true);
            expect(result).toStrictEqual({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                date: result.date,
                is_delete: result.is_delete,
            });
        });
    });
    describe('verifyCommentExist', () => {
        it('should return 404 if comment isnt exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & assert
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await expect(commentRepo.verifyCommentExist('comment-xyz')).rejects.toThrowError(NotFoundError);
        });
        it('should not return 404 if comment exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & assert
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await expect(commentRepo.verifyCommentExist('comment-123')).resolves.not.toThrowError(NotFoundError);
        });
    });
});
