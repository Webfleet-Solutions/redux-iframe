import React, { ChangeEvent, EventHandler, FunctionComponent } from 'react'
import './checkbox.css'

type CheckboxProps = {
    label: string,
    checked: boolean,
    onChange: EventHandler<ChangeEvent<HTMLInputElement>>
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label, checked, onChange }) => (
    <label className='Checkbox'>
        <input type='checkbox' checked={checked} onChange={onChange} />
        {label}
    </label>
)
