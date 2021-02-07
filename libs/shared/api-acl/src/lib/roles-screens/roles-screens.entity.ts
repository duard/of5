import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { RoleEntity, ScreenEntity } from '..';

@Entity({ name: 'roles_screens' })
export class RoleScreenEntity extends BaseMysqlEntity {
  constructor(role?: RoleEntity, screen?: ScreenEntity) {
    super();
    this.role = role;
    this.screen = screen;
  }

  @ManyToOne(() => RoleEntity, (role) => role.roleScreens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @ManyToOne(() => ScreenEntity, (screen) => screen.roleScreens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screen_id', referencedColumnName: 'id' })
  screen: ScreenEntity;
}
