const request= require('supertest');
const app =require('../index.js');
const prisma =require('../config/prismaClient.js')

const bcrypt =require('bcrypt');
// import jwt from 'jsonwebtoken';


// jest.unstable_mockModule('../config/prismaClient.js', () => ({
//   default: {
//     user: {
//       findUnique: jest.fn(),
//       create: jest.fn(),
//     },
//   },
// }));



describe('Auth API (Prisma version)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 'test-uuid',
      email: 'test@example.com',
    });


    const res = await request(app)
      .post('/api/auth/register-user')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age:"30",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not register if user exists', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-uuid',
      email: 'test@example.com',
    });

    const res = await request(app)
      .post('/api/auth/register-user')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age:"30",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('User already registered with this email');
  });

  it('should login with correct credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-uuid',
      email: 'test@example.com',
      password: 'hashedpassword',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login-user')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-uuid',
      email: 'test@example.com',
      password: 'hashedpassword',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login-user')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Password is incorrect , your username and password is mismatched');
  });

  it('should not login with non-existing user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login-user')
      .send({
        email: 'unknown@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('User not Found or not registered yet');
  });

  it('should check for ')

});
