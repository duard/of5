import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleFilter } from './role-filter.entity';
import { Screen } from './screen.entity';

@Entity({ name: 'filter' })
export class Filter {
  constructor(partialFilter?: Partial<Filter>) {
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

  @ManyToOne((type) => Screen, (screen) => screen.filters)
  screen: Screen;

  @OneToMany((type) => RoleFilter, (roleFilter) => roleFilter.filter, { onDelete: 'CASCADE' })
  roleFilters: RoleFilter[];
}
