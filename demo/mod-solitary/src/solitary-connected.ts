import { ChangeEvent } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { setOwnColor, OWN_COLOR_STATE } from './own-color-duck'
import { Solitary, SolitaryDispatchProps, SolitaryStateProps } from './solitary'

const mapStateToProps = (state: Record<string, any>): SolitaryStateProps => ({
    isHighlighted: state[OWN_COLOR_STATE]
})

const mapDispatchToProps = (dispatch: Dispatch): SolitaryDispatchProps => ({
    setOwnColor: (event: ChangeEvent<HTMLInputElement>) => dispatch(setOwnColor(event.target.checked))
})

export const SolitaryConnected = connect(mapStateToProps, mapDispatchToProps)(Solitary)
