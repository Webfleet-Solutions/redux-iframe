import { connect } from 'react-redux'
import { MODULE_COLOR_STATE } from 'lib-common'
import { Consumer, ConsumerStateProps } from './consumer'

const mapStateToProps = (state: Record<string, any>): ConsumerStateProps => ({
    isHighlighted: state[MODULE_COLOR_STATE]
})

export const ConsumerConnected = connect(mapStateToProps)(Consumer)
