import Redis from 'ioredis'
import { env } from '../../config/envValidation'

export const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
})
