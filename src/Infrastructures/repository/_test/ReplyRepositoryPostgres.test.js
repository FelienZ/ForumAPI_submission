const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('Reply Repository Postgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await ReplyTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });
    describe('addReply', () => {
        it('should persist comment and return ReplyData correctly via getById', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);

            // Assert
            const reply = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(reply).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: reply.date,
                is_delete: reply.is_delete,
            });
        });
    });
    describe('getRepliesByCommentId', () => {
        it('should return Reply Data if Comment exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);

            // Action & Assert
            const replies = await ReplyTableTestHelper.findRepliesByCommentId('comment-123');
            expect(replies[0]).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: replies[0].date,
                is_delete: replies[0].is_delete,
            });
        });
    });
    describe('getReplyById', () => {
        it('Should return Reply Data if Reply Exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);

            // Action & Assert
            const reply = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(reply).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: reply.date,
                is_delete: reply.is_delete,
            });
        });
    });
    describe('deleteReply', () => {
        it('should delete match reply data', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);
            await replyRepo.deleteReply('reply-123');

            // Action & assert
            const result = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(result.is_delete).toEqual(true);
            expect(result).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: result.date,
                is_delete: result.is_delete,
            });
        });
    });
    describe('verifyReplyExist', () => {
        it('should return 404 if reply isnt exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);
            await expect(replyRepo.verifyReplyExist('reply-xyz')).rejects.toThrowError(NotFoundError);
        });
        it('should not return 404 if reply exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new NewThread({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new NewComment({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);
            await expect(replyRepo.verifyReplyExist('reply-123')).resolves.not.toThrowError(NotFoundError);
        });
    });
});
