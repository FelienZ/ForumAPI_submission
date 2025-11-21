const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentData = require('../../../Domains/comments/entities/CommentData');
const ThreadData = require('../../../Domains/threads/entities/ThreadData');
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
            const threadData = new ThreadData({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepo.addComment(commentData);

            // Assert
            const comment = await CommentTableTestHelper.findCommentById('comment-123');
            expect(comment).toHaveLength(1);
            expect(addedComment).toBeInstanceOf(CommentData);
            expect(addedComment.id).toEqual('comment-123');
            expect(addedComment.content).toEqual('ini content comment');
            expect(addedComment.owner).toEqual('user-456');
        });

        it('should throw NotFoundError when thread is not found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content', owner: 'user-456' });

            // Act & Assert
            await expect(commentRepo.addComment(commentData)).rejects.toThrow(NotFoundError);
        });
    });
    describe('getCommentsByThreadId', () => {
        it('should return Comment Data if Thread is exist', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const addedComment = await commentRepo.addComment(commentData);

            // Action & Assert
            const comment = await commentRepo.getCommentsByThreadId('thread-123');
            expect(addedComment).toBeInstanceOf(CommentData);
            expect(comment[0].id).toEqual('comment-123');
            expect(comment[0].content).toEqual('ini content comment');
            // ini dimapping owner jadi username
            expect(comment[0].username).toEqual('dicoding-student');
        });
        it('should return string **komentar telah dihapus** after deleted', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const addedComment = await commentRepo.addComment(commentData);

            // Action & Assert
            await commentRepo.deleteComment('comment-123');
            const comment = await commentRepo.getCommentsByThreadId('thread-123');
            expect(addedComment).toBeInstanceOf(CommentData);
            expect(comment[0].content).toEqual('**komentar telah dihapus**');
        });
    });
    describe('getCommentById', () => {
        it('Should return Not Found Error if Comment isnt exist', async () => {
        // Arrange
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepo.getCommentById('comment-123')).rejects.toThrow(NotFoundError);
        });
        it('Should retun Comment Data if Comment Exist', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const addedComment = await commentRepo.addComment(commentData);

            // Action
            const comment = await commentRepo.getCommentById('comment-123');

            // Assert
            expect(addedComment).toBeInstanceOf(CommentData);
            expect(comment.id).toEqual('comment-123');
            expect(comment.content).toEqual('ini content comment');
            expect(comment.owner).toEqual('user-456');
        });
    });
    describe('deleteComment', () => {
        it('Should return not found error if comment isn\'t exist', async () => {
        // Arrange
            const fakeIdGenerator = () => '123';
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(commentRepo.deleteComment('comment-123')).rejects.toThrow(NotFoundError);
        });
        it('should delete match comment', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul', body: 'isi', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            await threadRepo.addThread(threadData);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepo.addComment(commentData);

            // Action & assert
            await commentRepo.deleteComment('comment-123');
            const result = await CommentTableTestHelper.findCommentById('comment-123');
            expect(result[0]).toMatchObject({ is_delete: true });
        });
    });
});
