import { AnyAction } from 'redux'

export const SET_OWN_COLOR = 'SET_OWN_COLOR'
export const OWN_COLOR_STATE = 'OWN_COLOR'

type OwnColorAction = AnyAction & {
    checked: boolean
}

export const setOwnColor = (checked: boolean): OwnColorAction => ({
    type: SET_OWN_COLOR,
    checked: checked
})

export const ownColorReducer = (state = false, action: AnyAction): boolean => (
    action.type === SET_OWN_COLOR ? (action as OwnColorAction).checked : state
)
