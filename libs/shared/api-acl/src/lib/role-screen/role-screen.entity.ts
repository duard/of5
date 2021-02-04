import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RoleEntity } from '../role/role.entity';
import { ScreenEntity } from '../screen/screen.entity';

@Entity({ name: 'role_screen' })
export class RoleScreenEntity {
  constructor(role?: RoleEntity, screen?: ScreenEntity) {
    this.role = role;
    this.screen = screen;
  }

  @PrimaryGeneratedColumn()
  roleScreenId: number;

  @ManyToOne(() => RoleEntity, (role) => role.roleScreens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => ScreenEntity, (screen) => screen.roleScreens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screen_id', referencedColumnName: 'screenId' })
  screen: ScreenEntity;
}
