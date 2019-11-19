import React, { ChangeEvent, EventHandler, FunctionComponent } from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import Iframe from 'react-iframe'
import { IFRAME_ID } from './constants'
import { Checkbox } from './checkbox'
import { Home } from './home'
import './menu.css'

export type MenuStateProps = {
    menuHighlighted: boolean,
    moduleColorChecked: boolean
}

export type MenuDispatchProps = {
    setModuleColor: EventHandler<ChangeEvent<HTMLInputElement>>
}

type MenuProps = MenuStateProps & MenuDispatchProps

export const Menu: FunctionComponent<MenuProps> = ({ menuHighlighted, moduleColorChecked, setModuleColor }) => (
    <BrowserRouter>
        <nav>
            <ul className={'Menu' + (menuHighlighted ? ' MenuHighlighted' : '')}>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/consumer'>Consumer</Link></li>
                <li><Link to='/producer'>Producer</Link></li>
                <li><Link to='/solitary'>Solitary</Link></li>
                <li><Checkbox label='Change color of Consumer module' checked={moduleColorChecked} onChange={setModuleColor}/></li>
            </ul>
        </nav>
        <Route path='/' exact component={Home} />
        <Route path='/consumer' render={() => <Iframe id={IFRAME_ID} url='/index-consumer.html'/>} />
        <Route path='/producer' render={() => <Iframe id={IFRAME_ID} url='/index-producer.html'/>} />
        <Route path='/solitary' render={() => <Iframe id={IFRAME_ID} url='/index-solitary.html'/>} />
    </BrowserRouter>
)
