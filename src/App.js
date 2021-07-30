import { Route, Switch, BrowserRouter } from "react-router-dom";
import './App.css';
import Game from './components/Game';
import Home from './components/Home';
import './assets/css/foundation.css';

function App() {
  return (
    <div className="App">
      <div className="grid-container">
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/game" component={Game} />
      </Switch>
    </BrowserRouter>

      </div>
      <div className="bg"></div>
    </div>
  );
}

export default App;
