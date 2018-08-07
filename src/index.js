import { createRuntime } from 'babel-plugin-jsx-dom-expressions'
import { autorun } from 'mobx'

export default createRuntime({wrap: autorun})