export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'password',
    name: process.env.DB_NAME ?? 'worldcup',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  rabbitmq: {
    host: process.env.RMQ_HOST ?? 'localhost',
    port: parseInt(process.env.RMQ_PORT ?? '5672', 10),
    username: process.env.RMQ_USER ?? 'guest',
    password: process.env.RMQ_PASS ?? 'guest',
  },
  sms: {
    apiKey: process.env.SMS_API_KEY ?? 'sandbox',
    lineNumber: process.env.SMS_LINE ?? '3000773290',
  },
});
