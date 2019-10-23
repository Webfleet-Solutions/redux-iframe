import React, { ChangeEvent, EventHandler, Fragment, FunctionComponent } from 'react'
import { Dispatch } from 'redux'
import { Checkbox } from './checkbox'
import './producer.css'

export type ProducerStateProps = {
    menuColorChecked: boolean
}

export type ProducerDispatchProps = {
    setMenuColor: EventHandler<ChangeEvent<HTMLInputElement>>
}

type ProducerProps = ProducerStateProps & ProducerDispatchProps

export const Producer: FunctionComponent<ProducerProps> = ({ menuColorChecked, setMenuColor }) => (
    <Fragment>
        <div className='Producer'>
            <h3>Producer</h3>
            <div>A module sending action events to the application</div>
        </div>
        <Checkbox label='Change menu color' checked={menuColorChecked} onChange={setMenuColor} />
    </Fragment>
)
