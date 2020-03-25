import {
  asClass,
  InjectionMode,
  Lifetime
} from 'awilix'
import { dependencyPaths } from './config'
import { container } from './container'

container.loadModules(
  dependencyPaths, {
    formatName: 'camelCase',
    resolverOptions: {
      injectionMode: InjectionMode.PROXY,
      lifetime: Lifetime.SINGLETON,
      register: asClass
    }
  }
)
