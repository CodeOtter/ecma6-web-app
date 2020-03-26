import {
  asFunction,
  asClass,
  Lifetime,
  InjectionMode
} from 'awilix'
import { container } from '../../src/container'

container.loadModules([
  [
    'test/mocks/providers/**/*.js', {
      lifetime: Lifetime.SINGLETON,
      register: asFunction
    }
  ],
  [
    'src/services/**/*.js', {
      injectionMode: InjectionMode.PROXY,
      lifetime: Lifetime.SINGLETON,
      register: asClass
    }
  ]
])
