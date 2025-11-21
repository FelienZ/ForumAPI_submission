const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentData = require('../../../Domains/comments/entities/CommentData');
const ReplyData = require('../../../Domains/replies/entities/ReplyData');
const ThreadData = require('../../../Domains/threads/entities/ThreadData');
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
            const threadData = new ThreadData({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new ReplyData({ commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123' });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            const addedReply = await replyRepo.addReply(replyData);
            // Assert
            const reply = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(reply).toHaveLength(1);
            expect(addedReply).toBeInstanceOf(ReplyData);
            expect(addedReply.id).toEqual('reply-123');
            expect(addedReply.content).toEqual('ini balasan comment');
            expect(addedReply.owner).toEqual('user-123');
        });

        it('should throw NotFoundError when comment is not found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            // skip arrange instance comment
            const replyData = new ReplyData({ commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123' });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Act & Assert
            await threadRepo.addThread(threadData);
            // await commentRepo.addComment(commentData);
            await expect(replyRepo.addReply(replyData)).rejects.toThrow(NotFoundError);
        });
    });
    describe('getRepliesByCommentId', () => {
        it('should return Reply Data if Comment exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new ReplyData({ commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123' });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            const addedReply = await replyRepo.addReply(replyData);

            // Action & Assert
            const replies = await replyRepo.getRepliesByCommentId('comment-123');
            expect(addedReply).toBeInstanceOf(ReplyData);
            expect(replies[0].id).toEqual('reply-123');
            expect(replies[0].content).toEqual('ini balasan comment');
            expect(replies[0].username).toEqual('dicoding');
        });
        it('should return string **balasan telah dihapus** after deleted', async () => {
        // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new ReplyData({ commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123' });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            const addedReply = await replyRepo.addReply(replyData);
            await replyRepo.deleteReply('reply-123');

            // Assert
            const reply = await replyRepo.getRepliesByCommentId('comment-123');
            expect(addedReply).toBeInstanceOf(ReplyData);
            expect(reply[0].content).toEqual('**balasan telah dihapus**');
        });
    });
    describe('getReplyById', () => {
        it('Should return Not Found Error if Reply isnt exist', async () => {
        // Arrange
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
            // skip add
            // Action & Assert
            await expect(replyRepo.getReplyById('reply-123')).rejects.toThrow(NotFoundError);
        });
        it('Should return Reply Data if Reply Exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new ReplyData({ commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123' });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            const addedReply = await replyRepo.addReply(replyData);
            const reply = await replyRepo.getReplyById('reply-123');

            // Assert
            expect(addedReply).toBeInstanceOf(ReplyData);
            expect(reply.id).toEqual('reply-123');
            expect(reply.content).toEqual('ini balasan comment');
            expect(reply.owner).toEqual('user-123');
        });
    });
    describe('deleteReply', () => {
        it('Should return not found error if reply isnt exist', async () => {
        // Arrange
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await expect(replyRepo.deleteReply('reply-123')).rejects.toThrow(NotFoundError);
        });
        it('should delete match reply data', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const threadData = new ThreadData({ title: 'judul thread', body: 'body thread', owner: 'user-123' });
            const fakeIdGenerator = () => '123';
            const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const commentData = new CommentData({ threadId: 'thread-123', content: 'ini content comment', owner: 'user-456' });
            const commentRepo = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const replyData = new ReplyData({ commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123' });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepo.addThread(threadData);
            await commentRepo.addComment(commentData);
            await replyRepo.addReply(replyData);
            await replyRepo.deleteReply('reply-123');

            // Action & assert
            const result = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(result[0]).toMatchObject({ is_delete: true });
        });
    });
});
