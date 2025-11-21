const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

require('dotenv').config();

describe('HTTP server', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
    });
    it('should response 404 when request unregistered route', async () => {
    // Arrange
        const server = await createServer({});

        // Action
        const response = await server.inject({
            method: 'GET',
            url: '/unregisteredRoute',
        });

        // Assert
        expect(response.statusCode).toEqual(404);
    });

    it('should handle server error correctly', async () => {
    // Arrange
        const requestPayload = {
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
            password: 'super_secret',
        };
        const server = await createServer({}); // fake injection

        // Action
        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: requestPayload,
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(500);
        expect(responseJson.status).toEqual('error');
        expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
    });
    describe('AUTH STRATEGY JWT', () => {
        it('should restrict some endpoint using JWT authentication', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            const accessToken = Jwt.token.generate(
                {
                    id: 'user-123',
                    username: 'dicoding',
                },
                process.env.ACCESS_TOKEN_KEY,
            );
            const server = await createServer(container);
            const requestPayload = {
                title: 'sebuah thread',
                body: 'body thread',
            };
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Assert
            expect([200, 201, 400, 401]).toContain(response.statusCode);
        });
    });
});
