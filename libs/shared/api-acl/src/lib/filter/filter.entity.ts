import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleFilterEntity } from '../role-filter/role-filter.entity';
import { ScreenEntity } from '../screen/screen.entity';

@Entity({ name: 'filter' })
export class FilterEntity {
  constructor(partialFilter?: Partial<FilterEntity>) {
    this.fieldName = partialFilter?.fieldName;
    this.operation = partialFilter?.operation;
    this.screen = partialFilter?.screen;
    this.value = partialFilter?.value;
  }

  @PrimaryGeneratedColumn()
  filterId: number;

  @Column()
  fieldName: string;

  @Column()
  operation: string;

  @Column({ nullable: true })
  value: string;

  @ManyToOne((type) => ScreenEntity, (screen) => screen.filters)
  screen: ScreenEntity;

  @OneToMany((type) => RoleFilterEntity, (roleFilter) => roleFilter.filter, { onDelete: 'CASCADE' })
  roleFilters: RoleFilterEntity[];
}
