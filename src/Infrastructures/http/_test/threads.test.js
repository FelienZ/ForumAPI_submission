const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');

describe('/threads endpoint', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });
    describe('when POST /threads', () => {
        it('should response 201 and persisted threads if authorized', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
                body: 'body thread',
            };
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            // eslint-disable-next-line no-undef
            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                auth: {
                    credentials: { id: 'user-123' },
                    strategy: 'forumapi_jwt',
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });
    describe('When GET /threads/{threadId}', () => {
        it('Should response 200 and return thread data (with Comment) for all user', async () => {
            const server = await createServer(container);
            // Arrange
            // Bikin Thread dulu
            const requestPayload = {
                title: 'sebuah thread',
                body: 'body thread',
            };
            await UsersTableTestHelper.addUser({ id: 'user-998', username: 'userX' });
            await UsersTableTestHelper.addUser({ id: 'user-990', username: 'userY' });

            // Action
            const createThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                auth: {
                    credentials: { id: 'user-998' },
                    strategy: 'forumapi_jwt',
                },
            });
            const threadResponseJson = JSON.parse(createThread.payload);
            const { id: threadId } = threadResponseJson.data.addedThread;
            // bikin Comment ke Thread Baru
            await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'ini comment' },
                auth: {
                    credentials: { id: 'user-990' },
                    strategy: 'forumapi_jwt',
                },
            });
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });
    });
    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and delete comment in thread', async () => {
            const server = await createServer(container);
            // Arrange
            // Bikin Thread dulu
            const requestPayload = {
                title: 'sebuah thread',
                body: 'body thread',
            };
            await UsersTableTestHelper.addUser({ id: 'user-998', username: 'userX' });
            await UsersTableTestHelper.addUser({ id: 'user-990', username: 'userY' });

            // Action
            const createThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                auth: {
                    credentials: { id: 'user-998' },
                    strategy: 'forumapi_jwt',
                },
            });
            const threadResponseJson = JSON.parse(createThread.payload);
            const { id: threadId } = threadResponseJson.data.addedThread;
            // bikin Comment ke Thread Baru -> ambil id
            const createComment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'ini comment' },
                auth: {
                    credentials: { id: 'user-990' },
                    strategy: 'forumapi_jwt',
                },
            });
            const commentResponseJson = JSON.parse(createComment.payload);
            const { id: commentId } = commentResponseJson.data.addedComment;
            // delete Comment di thread (pemilik comment)
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                auth: {
                    credentials: { id: 'user-990' },
                    strategy: 'forumapi_jwt',
                },
            });
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
