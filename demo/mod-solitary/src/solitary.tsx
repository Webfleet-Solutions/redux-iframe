import React, { ChangeEvent, EventHandler, Fragment, FunctionComponent } from 'react'
import { Checkbox } from './checkbox'
import './solitary.css'

export type SolitaryStateProps = {
    isHighlighted: boolean
}

export type SolitaryDispatchProps = {
    setOwnColor: EventHandler<ChangeEvent<HTMLInputElement>>
}

type SolitaryProps = SolitaryStateProps & SolitaryDispatchProps

export const Solitary: FunctionComponent<SolitaryProps> = ({ isHighlighted, setOwnColor }) => (
    <Fragment>
        <div className={'Solitary' + (isHighlighted ? ' SolitaryHighlighted' : '')}>
            <h3>Solitary</h3>
            <div>An isolated module with access to local storage</div>
        </div>
        <Checkbox label='Change color of this module' checked={isHighlighted} onChange={setOwnColor}/>
    </Fragment>
)
