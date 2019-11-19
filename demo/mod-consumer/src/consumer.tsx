import React, { FunctionComponent } from 'react'
import './consumer.css'

export type ConsumerStateProps = {
    isHighlighted: boolean
}

type ConsumerProps = ConsumerStateProps

export const Consumer: FunctionComponent<ConsumerProps> = ({ isHighlighted }) => (
    <div className={'Consumer' + (isHighlighted ? ' ConsumerHighlighted' : '')}>
        <h3>Consumer</h3>
        <div>A module receiving its state from the application</div>
    </div>
)
