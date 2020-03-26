import { dependencyPaths } from './config'
import { container } from './container'

container.loadModules(dependencyPaths)
