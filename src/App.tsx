import * as React from 'react'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

import Homepage from './pages/Homepage'
import Contact from './pages/Contact'
import MissingPage from './pages/404'

import {Socket} from './hooks/Socket'

import './css/main.css'

function App() {

    return (
        <Socket>
            <Router>
                <Switch>
                    <Route exact path="/" component={Homepage}/>
                    <Route exact path="/contact" component={Contact}/>
                    <Route component={MissingPage}/>
                </Switch>
            </Router>
        </Socket>
    );
}

export default App;
