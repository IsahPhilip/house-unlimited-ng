declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';

  interface CloudinaryStorageOptions {
    cloudinary: any;
    params: {
      folder: string;
      allowed_formats?: string[];
      public_id?: (req: any, file: Express.Multer.File) => string;
      transformation?: any;
      format?: string;
      resource_type?: string;
    } | ((req: any, file: Express.Multer.File) => {
      folder: string;
      allowed_formats?: string[];
      public_id?: string;
      transformation?: any;
      format?: string;
      resource_type?: string;
    }) | ((req: any, file: Express.Multer.File) => Promise<{
      folder: string;
      allowed_formats?: string[];
      public_id?: string;
      transformation?: any;
      format?: string;
      resource_type?: string;
    }>);
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: any,
      file: Express.Multer.File,
      callback: (error?: any, info?: any) => void
    ): void;
    _removeFile(
      req: any,
      file: Express.Multer.File,
      callback: (error?: any) => void
    ): void;
  }

  export { CloudinaryStorage };
}
