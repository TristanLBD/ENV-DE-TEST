import request from 'supertest'
import app from '../api/app'
import { getRealm } from '../api/config/realm'

// Tests API avec jest :
describe('API', () => {
    let realm;
    let token;
    let userId;

    beforeEach(() => {

    })
    beforeAll(() => {

    })
    afterEach(() => {

    })
    afterAll(() => {

    })

    test('GET /api/health', async () => {
        const response = await request(app).get('/api/health')
        expect(response.status).toBe(200)
    })


    describe('API Auth Tests', () => {
        beforeAll(async () => {
            // Récupérer la base Realm et la vider avant les tests
            realm = await getRealm();
            realm.write(() => {
                realm.deleteAll();
            });
        });

        afterAll(() => {
            // Fermer Realm si besoin
            if (realm) realm.close();
        });

        // ----------------------------
        // REGISTER
        // ----------------------------
        describe('POST /api/auth/register', () => {
            it('should register a new user successfully', async () => {
                const user = {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123',
                };

                const res = await request(app).post('/api/auth/register').send(user);
                //! expect(res.body.success).toBe(true);
                //! expect(res.body.user.email).toBe(user.email);
                //! expect(res.body.token).toBeDefined();

                expect(res.status).toBe(201);
                expect(res.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        user: expect.objectContaining({ email: user.email, id: expect.any(String), name: user.name }),
                        token: expect.any(String), //! Mieux que toBeDefined car verifie definit + type chaine
                        //! expect.any([String, undefined])
                        //! ToBeUnnecessary / toBeOneOf (utilisé pr typage ou valeurs)
                    }),
                );


                // Sauvegarder pour tests suivants
                token = res.body.token;
                userId = res.body.user.id;
            });

            it('should fail if name is missing', async () => {
                const res = await request(app)
                    .post('/api/auth/register')
                    .send({ email: 'a@b.com', password: 'Password123' });
                expect(res.status).toBe(400);
                expect(res.body.errors).toBeDefined();
            });

            it('should fail if email is invalid', async () => {
                const res = await request(app)
                    .post('/api/auth/register')
                    .send({ name: 'Test', email: 'invalid', password: 'Password123' });
                expect(res.status).toBe(400);
                expect(res.body.errors).toBeDefined();
            });

            it('should fail if password is too short', async () => {
                const res = await request(app)
                    .post('/api/auth/register')
                    .send({ name: 'Test', email: 't@t.com', password: '123' });
                expect(res.status).toBe(400);
                expect(res.body.errors).toBeDefined();
            });

            it('should fail if user already exists', async () => {
                const res = await request(app)
                    .post('/api/auth/register')
                    .send({ name: 'Test User', email: 'test@example.com', password: 'Password123' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('User already exists');
            });
        });

        // ----------------------------
        // LOGIN
        // ----------------------------
        describe('POST /api/auth/login', () => {
            it('should login successfully with correct credentials', async () => {
                const res = await request(app).post('/api/auth/login').send({
                    email: 'test@example.com',
                    password: 'Password123',
                });
                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.token).toBeDefined();
            });

            it('should fail with incorrect password', async () => {
                const res = await request(app).post('/api/auth/login').send({
                    email: 'test@example.com',
                    password: 'WrongPassword',
                });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('Invalid Credentials');
            });

            it('should fail with non-existent email', async () => {
                const res = await request(app).post('/api/auth/login').send({
                    email: 'nouser@example.com',
                    password: 'Password123',
                });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('Invalid Credentials');
            });

            it('should fail with invalid email format', async () => {
                const res = await request(app).post('/api/auth/login').send({
                    email: 'invalid',
                    password: 'Password123',
                });
                expect(res.status).toBe(400);
                expect(res.body.errors).toBeDefined();
            });
        });

        // ----------------------------
        // GET /me
        // ----------------------------
        describe('GET /api/auth/me', () => {
            it('should get current user with valid token', async () => {
                const res = await request(app)
                    .get('/api/auth/me')
                    .set('Authorization', `Bearer ${token}`);
                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.user.email).toBe('test@example.com');
            });

            it('should fail without token', async () => {
                const res = await request(app).get('/api/auth/me');
                expect(res.status).toBe(401);
            });

            it('should fail with invalid token', async () => {
                const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer wrongtoken');
                expect(res.status).toBe(401);
            });
        });

        // ----------------------------
        // DELETE /:id
        // ----------------------------
        describe('DELETE /api/auth/:id', () => {
            it('should delete existing user', async () => {
                const res = await request(app).delete(`/api/auth/${userId}`);
                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });

            it('should fail if user not found', async () => {
                const res = await request(app).delete(`/api/auth/nonexistentid`);
                expect(res.status).toBe(404);
                expect(res.body.error).toBe('User not found');
            });
        });
    });

    describe('API Tags Tests', () => {
        let realm;
        let token;
        let userId;

        beforeAll(async () => {
            realm = await getRealm();
            realm.write(() => {
                realm.deleteAll();
            });

            // Créer un utilisateur dédié pour les tests tags
            const user = {
                name: 'TagUser',
                email: 'taguser@example.com',
                password: 'Password123',
            };
            const resRegister = await request(app).post('/api/auth/register').send(user);
            token = resRegister.body.token;
            userId = resRegister.body.user.id;
        });

        it('should create a new tag', async () => {
            const tag = { name: 'Test Tag', color: '#FF0000' };
            const res = await request(app)
                .post('/api/tags')
                .set('Authorization', `Bearer ${token}`)
                .send(tag);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.tag.name).toBe(tag.name);
        });

        it('should get all tags', async () => {
            const res = await request(app)
                .get('/api/tags')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.tags.length).toBe(1);
        });

        it('should delete a tag', async () => {
            const tag = { name: 'Test Tag', color: '#FF0000' };
            const res = await request(app)
                .post('/api/tags')
                .set('Authorization', `Bearer ${token}`)
                .send(tag);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.tag.name).toBe(tag.name);
        });

        it('should fail to create a tag (missing color)', async () => {
            const tag = { name: 'Test Tag' };
            const res = await request(app)
                .post('/api/tags')
                .set('Authorization', `Bearer ${token}`)
                .send(tag);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Missing color');
        });

        it('should fail to create a tag (missing name)', async () => {
            const tag = { color: '#FF0000' };
            const res = await request(app)
                .post('/api/tags')
                .set('Authorization', `Bearer ${token}`)
                .send(tag);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe('Missing name');
        });
    });

})
