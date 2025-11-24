const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyData = require('../../../Domains/replies/entities/ReplyData');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

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
            const fakeIdGenerator = () => '123';
            const replyData = new NewReply({
                threadId: 'thread-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            // bukan main test -> helper, main test -> asli
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });

            // kembalian method add -> instance ReplyData
            const reply = await replyRepo.addReply(replyData);
            expect(reply.isDelete).toBeDefined();
            expect(reply.date).toBeDefined();
            expect(reply).toStrictEqual(new ReplyData({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: reply.date,
                is_delete: reply.isDelete,
            }));
            // kembalian findHelper
            const findreply = await ReplyTableTestHelper.findReplyById('reply-123');
            expect(findreply).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: findreply.date,
                is_delete: findreply.is_delete,
            });
        });
    });
    describe('getRepliesByCommentId', () => {
        it('should return Reply Data if Comment exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await ReplyTableTestHelper.addReply({
                id: 'reply-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            // kembalian getByCommentId (hasil join owner username)
            const replies = await replyRepo.getRepliesByCommentId('comment-123');
            expect(replies).toHaveLength(1);
            expect(replies[0].username).toBeDefined();
            expect(replies[0]).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                username: 'dicoding',
                date: replies[0].date,
                is_delete: replies[0].is_delete,
            });
            // kembalian findHelper
            const findreplies = await ReplyTableTestHelper.findRepliesByCommentId('comment-123');
            expect(findreplies).toHaveLength(1);
            expect(findreplies[0]).toStrictEqual({
                id: 'reply-123',
                content: 'ini balasan comment',
                comment_id: 'comment-123',
                owner: 'user-123',
                date: findreplies[0].date,
                is_delete: findreplies[0].is_delete,
            });
        });
    });
    describe('deleteReply', () => {
        it('should delete match reply data', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await ReplyTableTestHelper.addReply({
                id: 'reply-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            await replyRepo.deleteReply('reply-123');

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
        it('should return 404 if reply isnt exist or unmatch commentId stored with requested', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Assert
            await expect(replyRepo.verifyReplyExist('comment-xyz', 'reply-xyz')).rejects.toThrowError(NotFoundError);
        });
        it('should not return 404 if reply exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await ReplyTableTestHelper.addReply({
                id: 'reply-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            await expect(replyRepo.verifyReplyExist('comment-123', 'reply-123')).resolves.not.toThrowError(NotFoundError);
        });
    });
    describe('verifyReplyOwner', () => {
        it('should return 403 unauth if client isnt Reply owner', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await ReplyTableTestHelper.addReply({
                id: 'reply-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            await expect(replyRepo.verifyReplyOwner('reply-123', 'user-990')).rejects.toThrowError(AuthorizationError);
        });
        it('should not return 403 unauth if client is comment owner', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';
            const replyRepo = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            await ReplyTableTestHelper.addReply({
                id: 'reply-123', commentId: 'comment-123', content: 'ini balasan comment', owner: 'user-123',
            });
            await expect(replyRepo.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });
});
