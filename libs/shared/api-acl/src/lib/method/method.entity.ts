import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserGroupEntity } from '..';

@Entity({ name: 'method' })
export class MethodEntity {
  @PrimaryGeneratedColumn({ name: 'in_id' })
  id: number;

  @Column({ name: 'st_description', unique: true })
  description: string;

  @ManyToMany(() => UserGroupEntity, (group) => group.methods)
  @JoinTable({
    name: 'usergroup_method',
    joinColumn: {
      name: 'in_idmethod',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'in_idusergroup',
      referencedColumnName: 'id'
    }
  })
  userGroups: UserGroupEntity[];
}
