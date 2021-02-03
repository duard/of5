import { DefaultDataServiceConfig, EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data'

const entityMetadata: EntityMetadataMap = {}

const pluralNames = { Cargos: 'Cargos', Profiles: 'Profiles', Menus: 'Menus' }

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
}

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
  entityHttpResourceUrls: {},
}
