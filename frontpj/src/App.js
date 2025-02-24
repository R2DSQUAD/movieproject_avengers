import { RouterProvider } from 'react-router-dom';
import './App.css';
import root from './router/root';
import "./css/reset.css";

configure
function App() {
  return (
    <>
      <RouterProvider router={root}/>
    </>
  );
}

export default App;
