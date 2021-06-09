import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Confirmation from './components/Confirmation/Confirmation';
import Congratulation from './components/Congratulation/Congratulation';
import './App.css';

const initialState = {
  route: 'home',
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/confirmation" component={Confirmation} />
          <Route path="/congratulation" component={Congratulation} />
        </Switch>
      </div>
    );
  }
}

export default App;
