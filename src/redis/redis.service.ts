import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    // 在构造函数中初始化 Redis 客户端
    this.redisClient = new Redis({
      host: 'http://43.136.93.90',
      port: 6379,
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }
  // 存值
  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
  // 获取值
  async getValue(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }
  // 存值，设置过期时间
  setWithExpiry(key: string, value: string, time: number) {
    return this.redisClient.setex(key, time, value);
  }
  // 删除数据
  deleteKey(key: string) {
    return this.redisClient.del(key);
  }
  // 在哈希表（Hash）相关的方法中，field这是哈希表中的字段名称。

  //设置key中filed字段的数据value
  setHashField(key: string, field: string, value: string) {
    return this.redisClient.hset(key, field, value);
  }
  //获取key中的field字段数据
  getHashField(key: string, field: string) {
    return this.redisClient.hget(key, field);
  }
  //获取key中所有数据
  getAllHashFields(key: string) {
    return this.redisClient.hgetall(key);
  }
}
