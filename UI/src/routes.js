import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import Login, { LoginCheck } from './components/login/login'
import Home from './components/dashboard/home/home'
import history from './utils/history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/check_login" exact component={LoginCheck} />
                    <Route path="/dashboard" component={Home} />
                </Switch>
            </Router>
        )
    }
}