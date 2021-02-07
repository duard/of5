import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSharedModule, localeConfig } from '@of5/shared/api-shared';
import { I18nModule } from 'nestjs-i18n';

import { MethodEntity } from '.';
import { AccountModule } from './accounts/accounts.module';
import { AclModule } from './acl/acl.module';
import { ActionModule } from './actions/actions.module';
import { AuthModule } from './auth/auth.module';
import { FilterModule } from './filters/filters.module';
import { MenuGroupModule } from './menus-groups/menus-groups.module';
import { MenuItemModule } from './menus-itens/menus-itens.module';
import { ParameterModule } from './parameters/parameters.module';
import { RoleModule } from './roles/roles.module';
import { ScreenModule } from './screens/screens.module';
import { UserGroupModule } from './users-groups/users-groups.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ApiSharedModule,
    // MailerModule.forRoot(mailConfig),
    AuthModule,
    I18nModule.forRoot(localeConfig),
    TypeOrmModule.forFeature([MethodEntity]),
    UsersModule,
    UserGroupModule,
    MenuItemModule,
    MenuGroupModule,
    AccountModule,
    ParameterModule,
    ScreenModule,
    ActionModule,
    RoleModule,
    FilterModule,
    AclModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class ApiAclModule {}
