const { createClient } = require('redis');

// const redisClient = createClient({ url: 'redis://localhost:6379' }); // 'redis' is Docker service name
const redisClient = createClient({ url: 'redis://redis:6379' });
// const redisPublisher = createClient({ url: 'redis://localhost:6379' });
const redisPublisher = createClient({ url: 'redis://redis:6379' });

redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
redisPublisher.on('error', (err) => console.error('❌ Redis Publisher Error:', err));

async function connectRedis() {
  await redisClient.connect();
  await redisPublisher.connect();
  console.log('📡 Redis connected in User Service');
}

module.exports = { redisClient, redisPublisher, connectRedis };
