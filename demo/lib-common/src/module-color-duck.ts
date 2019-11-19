/**
 * Actions and reducers to control the color of module "mod-consumer".
 */
import { AnyAction } from 'redux'

export const SET_MODULE_COLOR = 'SET_MODULE_COLOR'
export const MODULE_COLOR_STATE = 'MODULE_COLOR'

type ModuleColorAction = AnyAction & {
    checked: boolean
}

export const setModuleColor = (checked: boolean): ModuleColorAction => ({
    type: SET_MODULE_COLOR,
    checked: checked
})

export const moduleColorReducer = (state = false, action: AnyAction): boolean => (
    action.type === SET_MODULE_COLOR ? (action as ModuleColorAction).checked : state
)

