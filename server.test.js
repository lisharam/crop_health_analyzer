// Basic Jest tests for API endpoints
const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0); // Use any available port
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const response = await request(server).get('/');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /api/ai', () => {
    it('should reject requests without prompt', async () => {
      const response = await request(server)
        .post('/api/ai')
        .send({});
      expect(response.statusCode).toBe(400);
    });

    it('should reject too long prompts', async () => {
      const response = await request(server)
        .post('/api/ai')
        .send({ prompt: 'a'.repeat(2001) });
      expect(response.statusCode).toBe(400);
    });

    it('should accept valid prompts', async () => {
      // Skip this test if no OpenAI key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping OpenAI test - no API key configured');
        return;
      }
      const response = await request(server)
        .post('/api/ai')
        .send({ prompt: 'Test prompt', lang: 'en' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('reply');
    });
  });
});