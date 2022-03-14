import { Pool } from 'pg';
import { RedisClient } from 'redis';
import * as Minio from 'minio';

export class CrmService {
  public static readerClient: Pool;
  public static writerClient: Pool;
  public static redisClient: RedisClient;
  public static s3Bucket: Minio.Client;
}
