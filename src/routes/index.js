// @SETUP: Import route definitions here

import './messages'
import './trees'
import './accounts'

import { resolve } from '../container'

resolve('LogService').debug('HTTP routes defined.')
