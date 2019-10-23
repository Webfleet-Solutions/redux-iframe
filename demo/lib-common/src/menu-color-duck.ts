/**
 * Actions and reducers to control the color of the application's menu.
 */
import { AnyAction } from 'redux'

export const SET_MENU_COLOR = 'SET_MENU_COLOR'
export const MENU_COLOR_STATE = 'MENU_COLOR'

type AppColorAction = AnyAction & {
    checked: boolean
}

export const setMenuColor = (checked: boolean): AppColorAction => ({
    type: SET_MENU_COLOR,
    checked: checked
})

export const menuColorReducer = (state = false, action: AnyAction): boolean => (
    action.type === SET_MENU_COLOR ? (action as AppColorAction).checked : state
)
