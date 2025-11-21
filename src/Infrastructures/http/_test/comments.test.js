const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

// comments -> restrict juga
describe('/threads/{threadId}/comments endpoint', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
    });
    afterAll(async () => {
        await pool.end();
    });
    describe('When POST /threads/{threadId}/comments', () => {
        it('Should response 201 and return comment data', async () => {
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
            // cek threadDetail
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });
            // Assert
            // uji response comment
            expect(createComment.statusCode).toEqual(201);
            expect(commentResponseJson.data.addedComment).toBeDefined();
            // response getDetail
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });
    });
});
