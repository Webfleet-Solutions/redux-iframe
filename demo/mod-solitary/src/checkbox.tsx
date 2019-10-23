import React, { ChangeEvent, EventHandler, FunctionComponent } from 'react'
import './checkbox.css'

type CheckboxProps = {
    label: string,
    checked: boolean,
    onChange: EventHandler<ChangeEvent<HTMLInputElement>>
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label, checked, onChange }) => (
    <div className='Checkbox'>
        <label>
            <input type='checkbox' checked={checked} onChange={onChange} />
            {label}
        </label>
    </div>
)
