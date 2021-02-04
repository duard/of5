import { BaseMysqlEntity } from '@of5/shared/api-shared';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ScreenEntity } from '..';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';

@Entity({ name: 'filters' })
export class FilterEntity extends BaseMysqlEntity {
  constructor(partialFilter?: Partial<FilterEntity>) {
    super();
    this.fieldName = partialFilter?.fieldName;
    this.operation = partialFilter?.operation;
    this.screen = partialFilter?.screen;
    this.value = partialFilter?.value;
  }

  @Column()
  fieldName: string;

  @Column()
  operation: string;

  @Column({ nullable: true })
  value: string;

  @ManyToOne(() => ScreenEntity, (screen) => screen.filters)
  @JoinColumn({ name: 'screen_id', referencedColumnName: 'id' })
  screen: ScreenEntity;

  @OneToMany(() => RoleFilterEntity, (roleFilter) => roleFilter.filter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_filter_id', referencedColumnName: 'id' })
  roleFilters: RoleFilterEntity[];
}
