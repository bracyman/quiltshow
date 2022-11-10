import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuiltEntry from './quilts/QuiltEntryForm';
import Header from './Header.js';

class App extends Component {
  render() {
    return (
        <div>
          <Header/>
          <Router>
            <Routes>
              <Route path='/' exact={true} element={<Home/>}/>
              <Route path='/quiltEntry' exact={true} element={<QuiltEntry/>}/>
            </Routes>
          </Router>
        </div>
    );
  }
}

export default App;