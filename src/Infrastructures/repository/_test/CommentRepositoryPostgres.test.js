const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentData = require('../../../Domains/comments/entities/CommentData');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

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
            const fakeIdGenerator = () => '123';
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            // misal sebelum addComment, addThread dulu (pakai helper karena bukan main test)
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });

            // ini main testnya, pakai repo asli
            // Act & Assert
            // kembalian addComment -> instance CommentData
            const comment = await commentRepo.addComment(commentData);
            expect(comment.isDelete).toBeDefined();
            expect(comment.date).toBeDefined();
            expect(comment).toStrictEqual(new CommentData({
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                id: 'comment-123',
                date: comment.date,
                is_delete: comment.isDelete,
            }));

            // kembalian findById
            const findcomment = await CommentTableTestHelper.findCommentById('comment-123');
            expect(findcomment.is_delete).toBeDefined();
            expect(findcomment.date).toBeDefined();
            expect(findcomment).toStrictEqual({
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                id: 'comment-123',
                date: findcomment.date,
                is_delete: findcomment.is_delete,
            });
        });
    });
    describe('getCommentsByThreadId', () => {
        it('should return Comment Data if Thread is exist', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            const comment = await commentRepo.getCommentsByThreadId('thread-123');
            // hasil join owner -> username
            expect(comment).toHaveLength(1);
            expect(comment[0].date).toBeDefined();
            expect(comment[0].username).toBeDefined();
            expect(comment[0].is_delete).toBeDefined();
            expect(comment[0]).toStrictEqual({
                id: 'comment-123',
                content: 'ini content comment',
                username: 'dicoding-student',
                date: comment[0].date,
                is_delete: comment[0].is_delete,
            });

            const findcomment = await CommentTableTestHelper.findCommentByThreadId('thread-123');
            // kembalian find -> select asterisk mentah (tanpa join username owner)
            expect(findcomment).toHaveLength(1);
            expect(comment[0].date).toBeDefined();
            expect(comment[0].is_delete).toBeDefined();
            expect(findcomment[0]).toStrictEqual({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'ini content comment',
                owner: 'user-456',
                date: findcomment[0].date,
                is_delete: findcomment[0].is_delete,
            });
        });
    });
    describe('deleteComment', () => {
        it('should delete match comment', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            // test utama pakai method asli delete
            await commentRepo.deleteComment('comment-123');

            // cek pakai helper
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
    describe('verifyCommentOwner', () => {
        it('should return 403 unauth if client isnt comment owner', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & assert
            // karena bukan main test, gunakan helper untuk add
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await expect(commentRepo.verifyCommentOwner('comment-123', 'user-990')).rejects.toThrowError(AuthorizationError);
        });
        it('should not return 403 unauth if client is comment owner', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await expect(commentRepo.verifyCommentOwner('comment-123', 'user-456')).resolves.not.toThrowError(NotFoundError);
        });
    });
    describe('verifyCommentExist', () => {
        it('should return 404 if comment isnt exist or unmatch threadId stored with requested', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // assert -> langsung saja cek yang gaada karena bahkan belum dibuat
            await expect(commentRepo.verifyCommentExist('thread-123', 'comment-123')).rejects.toThrowError(NotFoundError);
        });
        it('should not return 404 if comment exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul', body: 'isi', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await expect(commentRepo.verifyCommentExist('thread-123', 'comment-123')).resolves.not.toThrowError(NotFoundError);
        });
    });
});
