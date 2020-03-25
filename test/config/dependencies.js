import {
  asClass,
  InjectionMode,
  Lifetime
} from 'awilix'
import { container } from '../../src/container'

container.loadModules([
  [
    'test/mocks/**/*.js',
    {
      injectionMode: InjectionMode.PROXY,
      lifetime: Lifetime.SINGLETON,
      register: asClass
    }
  ]
])
