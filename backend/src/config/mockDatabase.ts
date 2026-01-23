import { logger } from '../utils/logger.js';

interface MockDocument {
  [key: string]: any;
}

interface MockCollection {
  [key: string]: MockDocument[];
}

class MockDatabase {
  private collections: MockCollection = {};
  private isConnected = false;

  async connect(): Promise<void> {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isConnected = true;
      logger.info('Mock Database Connected');
    } catch (error) {
      logger.error('Mock Database connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    logger.info('Mock Database disconnected');
  }

  async create<T>(collectionName: string, document: T): Promise<T> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }

    const newDocument = { ...document, _id: this.generateId() };
    this.collections[collectionName].push(newDocument);
    return newDocument as T;
  }

  async find<T>(collectionName: string, query: Record<string, any> = {}): Promise<T[]> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    if (!this.collections[collectionName]) {
      return [];
    }

    return this.collections[collectionName].filter(doc => {
      return Object.keys(query).every(key => {
        return doc[key] === query[key];
      });
    }) as T[];
  }

  async findOne<T>(collectionName: string, query: Record<string, any>): Promise<T | null> {
    const results = await this.find<T>(collectionName, query);
    return results.length > 0 ? results[0] : null;
  }

  async findById<T>(collectionName: string, id: string): Promise<T | null> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    if (!this.collections[collectionName]) {
      return null;
    }

    const result = this.collections[collectionName].find(doc => doc._id === id);
    return result ? result as T : null;
  }

  async updateOne<T>(collectionName: string, query: Record<string, any>, update: Record<string, any>): Promise<T | null> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    if (!this.collections[collectionName]) {
      return null;
    }

    const index = this.collections[collectionName].findIndex(doc => {
      return Object.keys(query).every(key => {
        return doc[key] === query[key];
      });
    });

    if (index === -1) {
      return null;
    }

    this.collections[collectionName][index] = {
      ...this.collections[collectionName][index],
      ...update
    };

    return this.collections[collectionName][index] as T;
  }

  async deleteOne<T>(collectionName: string, query: Record<string, any>): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    if (!this.collections[collectionName]) {
      return false;
    }

    const initialLength = this.collections[collectionName].length;
    this.collections[collectionName] = this.collections[collectionName].filter(doc => {
      return !Object.keys(query).every(key => {
        return doc[key] === query[key];
      });
    });

    return this.collections[collectionName].length < initialLength;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

const mockDB = new MockDatabase();
export { mockDB };
