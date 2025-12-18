const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikesRepositoryPostgres = require('../CommentLikesReposisitoryPostgres');

describe('Reply Repository Postgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await CommentLikeTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });
    describe('addLike', () => {
        it('should insert comment Like data correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';

            const commentLikeRepo = new CommentLikesRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert -> bikin thread & comment dulu di helper
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            // ini void di repo
            await commentLikeRepo.addLike('comment-123', 'user-123');
            const findData = await CommentLikeTableTestHelper.findDataByCommentIdAndUserId('comment-123', 'user-123');
            expect(findData).toHaveLength(1);
            expect(findData[0]).toStrictEqual({
                id: 'like-123',
                comment_id: 'comment-123',
                user_id: 'user-123',
            });
        });
    });
    describe('deleteLike', () => {
        it('should delete comment Like data correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';

            const commentLikeRepo = new CommentLikesRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            // ini void di repo
            await commentLikeRepo.deleteLike('comment-123', 'user-123');
            const findData = await CommentLikeTableTestHelper.findDataByCommentIdAndUserId('comment-123', 'user-123');
            expect(findData).toHaveLength(0);
        });
    });
    describe('isLiked', () => {
        it('should check comment is liked or not correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            const fakeIdGenerator = () => '123';

            const commentLikeRepo = new CommentLikesRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });

            // default false krn blm dilike
            const isLiked = await commentLikeRepo.isLiked('comment-123', 'user-123');
            expect(isLiked).toEqual(false);
            // jika dilike baru true
            await commentLikeRepo.addLike('comment-123', 'user-123');
            const findData = await CommentLikeTableTestHelper.findDataByCommentIdAndUserId('comment-123', 'user-123');

            const isLiked2 = await commentLikeRepo.isLiked('comment-123', 'user-123');
            expect(isLiked2).toEqual(true);
            expect(findData).toHaveLength(1);
            expect(findData[0]).toStrictEqual({
                id: 'like-123',
                comment_id: 'comment-123',
                user_id: 'user-123',
            });
        });
    });
    describe('getLikesCountByCommentId', () => {
        it('should return count of comment like data correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding-student' });
            // id like unik di db, maka buat seperti count
            let id = 0;
            const fakeIdGenerator = () => {
                id += 1;
                return id.toString();
            };

            const commentLikeRepo = new CommentLikesRepositoryPostgres(pool, fakeIdGenerator);

            // Action & Assert
            await ThreadTableTestHelper.addThread({
                id: 'thread-123', title: 'judul thread', body: 'body thread', owner: 'user-123',
            });
            await CommentTableTestHelper.addComment({
                id: 'comment-123', threadId: 'thread-123', content: 'ini content comment', owner: 'user-456',
            });
            // ini void di repo (test like 2 kali -> user harus unik di tiap komen)
            await commentLikeRepo.addLike('comment-123', 'user-123');
            await commentLikeRepo.addLike('comment-123', 'user-456');

            const count = await commentLikeRepo.getLikesCountByCommentId('comment-123');
            expect(count).toEqual(2);
            await commentLikeRepo.deleteLike('comment-123', 'user-123');
            const count2 = await commentLikeRepo.getLikesCountByCommentId('comment-123');
            expect(count2).toEqual(1);
        });
    });
});
