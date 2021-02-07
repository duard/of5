import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as AWS_MESSAGES from '@of5/shared/api-shared';
import * as AWS from 'aws-sdk';

// tslint:disable-next-line: no-var-requires
const { v4: uuid } = require('uuid');

@Injectable()
export class AwsService {
  private accessKeyId: string;

  private secretAccessKey: string;

  private bucket: string;

  private s3Connection: any;

  constructor() {
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_KEY;
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  private connection() {
    if (!this.s3Connection) {
      this.s3Connection = new AWS.S3({
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      });
    }
    return this.s3Connection;
  }

  async uploadImage(buffer: Buffer, originalname: string): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const params = {
          Bucket: this.bucket,
          Key: `images/${new Date().toISOString()} - ${originalname}`,
          Body: buffer,
          ACL: 'public-read'
        };

        this.connection().upload(params, (err: any, data: any) => {
          if (err) {
            reject(new HttpException(AWS_MESSAGES.AWS.UPLOAD_FAILED, HttpStatus.BAD_REQUEST));
          }
          resolve(data.Location);
        });
      });
    } catch (err) {
      throw new HttpException(AWS_MESSAGES.AWS.UPLOAD_FAILED, 500);
    }
  }

  async uploadFile(file: any): Promise<ResponseAWSUpload> {
    return new Promise((resolve, reject) => {
      const splited = file.originalname.split('.');

      let extension = '';
      let key = '';

      if (splited.length > 1) {
        extension = splited[splited.length - 1];
        key = `file-manager/${this.generateUuid()}.${extension}`;
      } else {
        key = `file-manager/${this.generateUuid()}`;
      }

      const uploadsParams = {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read'
      };

      this.connection().upload(uploadsParams, (err: any, data: any) => {
        if (err) {
          reject(new HttpException(AWS_MESSAGES.AWS.UPLOAD_FAILED, 500));
        }

        resolve({ location: data.Location, uuid: data.Key, ext: extension ? `.${extension}` : '' });
      });
    });
  }

  /**
   * Faz upload para s3 especificando um caminho para salvar o arquivo. Se o arquivo existe então é sobrescrito.
   * @param {string} path pasta/para/salvar/
   * @param {any} file Arquivo para ser salvo na pasta especificada.
   * @param {number} limit (Opcional) Limite em MB do arquivo a ser feito o upload.
   * @return {ResponseAWSUpload} Objeto contendo a localização e a chave (uuid) do arquivo.
   */
  async uploadToPath(path: string, file: any, limit?: number): Promise<ResponseAWSUpload> {
    return new Promise((resolve, reject) => {
      if (limit) {
        // Verifica por um tamanho informado
        if (!this.fileIsLessThanOrEqual(file, limit)) {
          reject(new HttpException(AWS_MESSAGES.AWS.INVALID_FILE_SIZE, HttpStatus.BAD_REQUEST));
        }
      } else {
        // Verifica considerando o valor padrão de 100MB
        if (!this.fileIsLessThanOrEqual(file)) {
          reject(new HttpException(AWS_MESSAGES.AWS.INVALID_FILE_SIZE, HttpStatus.BAD_REQUEST));
        }
      }

      const splited = file.originalname.split('.');

      let extension = '';
      let key = '';

      if (splited.length > 1) {
        extension = splited[splited.length - 1];
        key = `${path}${this.generateUuid()}.${extension}`;
      } else {
        key = `${path}${this.generateUuid()}`;
      }

      const uploadsParams = {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read'
      };

      this.connection().upload(uploadsParams, (err: any, data: any) => {
        if (err) {
          reject(new HttpException(AWS_MESSAGES.AWS.UPLOAD_FAILED, 500));
        }
        resolve({ location: data.Location, uuid: data.Key, ext: extension ? `.${extension}` : '' });
      });
    });
  }

  async deleteFile(uuid: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const deleteBucketParams = {
        Bucket: this.bucket,
        Key: uuid
      };

      this.connection().deleteObject(deleteBucketParams, (err: any) => {
        if (err) {
          reject(new HttpException(AWS_MESSAGES.AWS.UPLOAD_FAILED, 500));
        }
        resolve(true);
      });
    });
  }

  async listBuckets() {
    return new Promise((resolve, reject) => {
      this.connection().listBuckets({}, (err: any, data: any) => {
        if (err) {
          reject(new HttpException(`Failed to list buckets: ${err.message}`, 500));
        }
        resolve(data);
      });
    });
  }

  async getFile(uuid: string) {
    const params = {
      Bucket: this.bucket,
      Key: uuid
    };

    return new Promise((resolve, reject) => {
      this.connection().getObject(params, (err: any, data: any) => {
        if (err) {
          reject(new HttpException(`Failed to get file: ${err.message}`, 500));
        }
        resolve(data);
      });
    });
  }

  async getFiles(quantity?: number): Promise<any> {
    const params = {
      Bucket: this.bucket,
      MaxKeys: quantity
    };

    return new Promise((resolve, reject) => {
      this.connection().listObjects(params, (err: any, data: any) => {
        if (err) {
          reject(new HttpException(`Failed to get file: ${err.message}`, 500));
        }
        resolve(data);
      });
    });
  }

  fileIsLessThanOrEqual(file: any, sizeInMB?: number): boolean {
    const fileSizeInMB = file.size / 1000000;

    sizeInMB = sizeInMB ? sizeInMB : 100;

    return fileSizeInMB <= sizeInMB ? true : false;
  }

  isJPEGOrJPGFormat(file: any): boolean {
    const header = file.buffer.subarray(0, 4);

    let parsedHeader = '';

    for (const item of header) {
      parsedHeader += item.toString(16);
    }

    parsedHeader = parsedHeader.toUpperCase();

    // Valid JPG or JPEG
    if (jpg.includes(parsedHeader)) {
      return true;
    }

    return false;
  }

  private generateUuid(): string {
    const now = Date.now();
    const dt = Math.floor(Date.now() + Math.random() * now + Math.random() * 22 * Math.random() + now).toString();
    return `${dt}-${uuid()}`;
  }
}

export interface ResponseAWSUpload {
  location: string;
  uuid: string;
  ext: string;
}

// JPG/JPEG Formats
const jpg = ['FFD8FFDB', 'FFD8FFE0', 'FFD8FFEE', 'FFD8FFE1'];

const gif = ['47494638'];

// tiff e tif
const tiff = ['49492A00', '4D4D002A'];

const rar = ['52617221'];

const png = ['89504E47'];

const pdf = ['25504446'];

const psd = ['38425053'];

const wav = ['52494646'];

const mp4 = ['66747970'];

const docx = ['504B34'];
