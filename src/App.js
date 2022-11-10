import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QuiltEntry from './quilts/QuiltEntryForm';
import Header from './Header.js'

class App extends Component {
  render() {
    return (
        <div>
          <Header/>
          <Router>
            <Switch>
              <Route path='/' exact={true} component={Home}/>
              <Route path='/quiltEntry' exact={true} component={QuiltEntry}/>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;