import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';

// Mocks
jest.mock('./menu-item.service');

describe('MenuItem Controller', () => {
  let controller: MenuItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemController],
      providers: [MenuItemService]
    }).compile();

    controller = module.get<MenuItemController>(MenuItemController);
  });

  it('MenuItemController => Deve conter uma instancia válida', () => {
    expect(controller).toBeDefined();
  });
});
