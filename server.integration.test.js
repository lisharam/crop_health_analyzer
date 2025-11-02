const request = require('supertest');
const app = require('./server');

describe('API Integration Tests', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0); // Use any available port
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/ai with real API key', () => {
    // Skip all tests if no API key is configured
    if (!process.env.OPENAI_API_KEY) {
      it.skip('Integration tests - OPENAI_API_KEY not configured', () => {});
      return;
    }

    it('should authenticate with proxy token', async () => {
      const response = await request(server)
        .post('/api/ai')
        .set('X-Proxy-Token', process.env.PROXY_TOKEN || '')
        .send({
          prompt: 'Test prompt',
          lang: 'en'
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('reply');
    });

    it('should reject invalid proxy token', async () => {
      const response = await request(server)
        .post('/api/ai')
        .set('X-Proxy-Token', 'invalid-token')
        .send({
          prompt: 'Test prompt',
          lang: 'en'
        });
      expect(response.statusCode).toBe(403);
    });

    it('should handle real OpenAI response', async () => {
      const response = await request(server)
        .post('/api/ai')
        .set('X-Proxy-Token', process.env.PROXY_TOKEN || '')
        .send({
          prompt: 'What are common tomato plant diseases?',
          lang: 'en'
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('reply');
      expect(typeof response.body.reply).toBe('string');
      expect(response.body.reply.length).toBeGreaterThan(0);
    });
  });
});