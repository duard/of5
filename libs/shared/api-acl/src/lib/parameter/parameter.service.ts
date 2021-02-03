import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IsArray } from 'class-validator';
import { Request } from 'express';
import { CreateParameterDTO, UpdateParameterByKeyDTO, UpdateParameterDTO } from 'src/dtos/parameter.dto';
import { Parameter } from 'src/entities/parameter.entity';
import { EXCEPTION } from 'src/enums/translate/exception.enum';
import { PARAMETER } from 'src/enums/translate/parameter.enum';
import { getUserFromRequest } from 'src/shared/utils/functions';
import { createQueryBuilder, Repository } from 'typeorm';

@Injectable()
export class ParameterService extends TypeOrmCrudService<Parameter> {
  constructor(
    @InjectRepository(Parameter)
    private readonly parameterRepository: Repository<Parameter>
  ) {
    super(parameterRepository);
  }

  @Override('createOneBase')
  async create(req: Request, dto: CreateParameterDTO) {
    const user = getUserFromRequest(req);
    const isDuplicatedKey = await this.parameterRepository.findOne({ where: { key: dto.key } });

    if (isDuplicatedKey) {
      throw new HttpException(PARAMETER.KEY_ALREADY_EXISTS, 400);
    }

    const parameter = this.parameterRepository.create(dto);

    parameter.createdBy = user;

    return await this.parameterRepository.save(parameter);
  }

  @Override('replaceOneBase')
  async update(req: Request, id: number, dto: UpdateParameterDTO) {
    const user = getUserFromRequest(req);

    const itExists = await this.parameterRepository.findOne(id);

    if (!itExists) {
      throw new HttpException(EXCEPTION.NOT_FOUND, 400);
    }

    if (dto.key) {
      const isDuplicatedKey = await this.parameterRepository.findOne({ where: { key: dto.key } });

      if (isDuplicatedKey) {
        throw new HttpException(PARAMETER.KEY_ALREADY_EXISTS, 400);
      }
    }

    const parameter = this.parameterRepository.create(dto);

    parameter.updatedBy = user;
    parameter.oldValue = itExists.value;

    await this.parameterRepository.update(id, parameter);

    return await this.parameterRepository.findOne(id, { relations: ['createdBy', 'updatedBy'] });
  }

  async updateByKey(req: Request, key: string, dto: UpdateParameterByKeyDTO) {
    const user = getUserFromRequest(req);

    const itExists = await this.repo.findOne({ where: { key } });

    let id: number;

    if (itExists) {
      id = itExists.id;
      await this.repo.update(id, { value: dto.value, oldValue: itExists.value, updatedBy: user });
    } else {
      id = (await this.repo.save({ key, value: dto.value, createdBy: user })).id;
    }

    return await this.repo.findOne(id);
  }

  async findByKey(req: Request, key: string) {
    const parameter = await this.repo.findOne({ where: { key } });

    if (!parameter) {
      return {};
    }

    return parameter;
  }

  async findByKeys(req: Request, keys: string[]) {
    if (!keys) {
      throw new HttpException('Informe ao menos uma key', HttpStatus.BAD_REQUEST);
    }

    let where = '';
    const params = {};

    if (Array.isArray(keys)) {
      keys.forEach((key, index) => {
        const hasNext = keys[index + 1];
        if (hasNext) {
          where += `parameter.key = :key${index} OR `;
          params[`key${index}`] = key;
        } else {
          where += `parameter.key = :key${index}`;
          params[`key${index}`] = key;
        }
      });
    } else {
      where += `parameter.key = :key`;
      params[`key`] = keys;
    }

    const parameters = createQueryBuilder(Parameter, 'parameter').where(where, params).getMany();

    return parameters;
  }
}
