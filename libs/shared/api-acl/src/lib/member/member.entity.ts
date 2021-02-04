import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserGroupEntity } from '..';
import { UserEntity } from '..';

@Entity({ name: 'members' })
export class MemberEntity {
  constructor(user?: UserEntity, group?: UserGroupEntity) {
    this.user = user;
    this.group = group;
  }

  @PrimaryGeneratedColumn({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => UserGroupEntity, (group) => group.members)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: UserGroupEntity;

  @ManyToOne(() => UserEntity, (user) => user.members)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
