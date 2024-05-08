// mongodb-logger.service.ts
import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ChangeLogger } from '../constants/interface/logger.interface';

@Injectable()
export class MongoDBLoggerService implements ChangeLogger {
  private readonly mongoClient: MongoClient;

  constructor() {
    this.mongoClient = new MongoClient(process.env.DATABASE_HOST);
    this.mongoClient.connect();
  }

  async logChange(oldValue: any, newValue: any, userId: string): Promise<void> {
    const db = this.mongoClient.db('hcsm');
    const changeLogCollection = db.collection('change_logs');
    if (userId && oldValue) {
      await changeLogCollection.insertOne({
        oldValue,
        newValue,
        userId,
        timestamp: new Date(),
      });
    }
  }
  async getLogs(): Promise<any[]> {
    const db = this.mongoClient.db('hcsm');
    const changeLogCollection = db.collection('change_logs');
    return await changeLogCollection.find().toArray();
  }
}
