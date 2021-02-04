import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ActionEntity, ScreenEntity } from '..';

@Entity({ name: 'actions_screen' })
export class ActionScreenEntity extends BaseMysqlEntity {
  constructor(screen?: ScreenEntity, action?: ActionEntity) {
    super();
    this.screen = screen;
    this.action = action;
  }

  @ManyToOne(() => ScreenEntity, (screen) => screen.actionsScreen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screen_id', referencedColumnName: 'id' })
  screen: ScreenEntity;

  @ManyToOne(() => ActionEntity, (action) => action.actionsScreen)
  @JoinColumn({ name: 'action_id', referencedColumnName: 'id' })
  action: ActionEntity;
}
