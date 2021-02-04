import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ActionEntity } from '..';
import { ScreenEntity } from '..';

@Entity()
export class ActionScreenEntity {
  constructor(screen?: ScreenEntity, action?: ActionEntity) {
    this.screen = screen;
    this.action = action;
  }

  @PrimaryGeneratedColumn()
  actionScreenId: number;

  @ManyToOne(() => ScreenEntity, (screen) => screen.actionsScreen, { onDelete: 'CASCADE' })
  screen: ScreenEntity;

  @ManyToOne(() => ActionEntity, (action) => action.actionsScreen)
  action: ActionEntity;
}
