import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_SERVICE_NAME, // Render Redis service name, red-xxxxxxxxxxxxxxxxxxxx
  port: Number(process.env.REDIS_PORT) || 6379, // Redis port
});

export { redisClient };
