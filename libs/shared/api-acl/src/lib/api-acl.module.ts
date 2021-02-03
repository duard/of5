import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';

import { ActionModule } from './action/action.module';
import { AuthModule } from './auth/auth.module';
import { FilterModule } from './filter/filter.module';
import { MenuGroupModule } from './menu-group/menu-group.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { ParameterModule } from './parameter/parameter.module';
import { RoleModule } from './role/role.module';
import { ScreenModule } from './screen/screen.module';
import { UserGroupModule } from './user-group/user-group.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // MailerModule.forRoot(mailConfig),
    AuthModule,
    // I18nModule.forRoot(localeConfig),
    UsersModule,
    UserGroupModule,
    MenuItemModule,
    MenuGroupModule,
    AccountModule,
    ParameterModule,
    ScreenModule,
    ActionModule,
    RoleModule,
    FilterModule
    // AclModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ApiAclModule {}
