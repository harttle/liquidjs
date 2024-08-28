import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './index.css';
import { App } from './App';
import { App as AppWithHooks } from './AppWithHooks';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Router>
    <Routes>
      <Route path="/" Component={App}/>
      <Route path="/with-hooks" Component={AppWithHooks}/>
    </Routes>
  </Router>
);
