import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrudRequest, CrudRequestOptions } from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { Repository } from 'typeorm';
import { MenuItem } from '../../entities/menu-item.entity';
import { MenuItemService } from './menu-item.service';

describe('MenuItemService => Tests', async () => {
  let menuItemService: MenuItemService;
  let module: TestingModule;
  let menuItemRepositoryMock: MockType<Repository<MenuItem>>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [MenuItemService, { provide: getRepositoryToken(MenuItem), useFactory: repositoryMockFactory }]
    }).compile();

    menuItemService = module.get<MenuItemService>(MenuItemService);
    menuItemRepositoryMock = module.get(getRepositoryToken(MenuItem));
  });

  it('should be defined', async () => {
    expect(menuItemService).toBeDefined();
  });

  it('should return true if active ', async () => {
    const menuItem = new MenuItem();
    const req: CrudRequest = new CrudRequestMock();
    expect(await menuItemService.getOne(null)).toBeInstanceOf(menuItem);
  });
});

export class CrudRequestMock implements CrudRequest {
  constructor() {
    this.options = {
      routes: {},
      params: {
        id: {
          field: 'id',
          type: 'number',
          primary: true
        }
      }
    };
  }

  parsed: ParsedRequestParams;
  options: CrudRequestOptions;
}

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  getOne: jest.fn()
}));

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
