import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ActionEntity } from '../action/action.entity';
import { ScreenEntity } from '../screen/screen.entity';

@Entity()
export class ActionScreenEntity {
  constructor(screen?: ScreenEntity, action?: ActionEntity) {
    this.screen = screen;
    this.action = action;
  }

  @PrimaryGeneratedColumn()
  actionScreenId: number;

  @ManyToOne((type) => ScreenEntity, (screen) => screen.actionsScreen, { onDelete: 'CASCADE' })
  screen: ScreenEntity;

  @ManyToOne((type) => ActionEntity, (action) => action.actionsScreen)
  action: ActionEntity;
}
