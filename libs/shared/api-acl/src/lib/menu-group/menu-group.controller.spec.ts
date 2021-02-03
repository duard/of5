import { Test, TestingModule } from '@nestjs/testing';
import { MenuGroupController } from './menu-group.controller';

describe('MenuGroup Controller', () => {
  let controller: MenuGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuGroupController]
    }).compile();

    controller = module.get<MenuGroupController>(MenuGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
