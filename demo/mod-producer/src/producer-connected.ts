import { ChangeEvent } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { setMenuColor, MENU_COLOR_STATE } from 'lib-common'
import { Producer, ProducerDispatchProps, ProducerStateProps } from './producer'

const mapStateToProps = (state: Record<string, any>): ProducerStateProps => ({
    menuColorChecked: state[MENU_COLOR_STATE]
})

const mapDispatchToProps = (dispatch: Dispatch): ProducerDispatchProps => ({
    setMenuColor: (event: ChangeEvent<HTMLInputElement>) => dispatch(setMenuColor(event.target.checked))
})

export const ProducerConnected = connect(mapStateToProps, mapDispatchToProps)(Producer)
