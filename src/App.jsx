import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import './App.css'
import HomePage from './pages/homePage'

function App() {

  return (
    <>
     <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />}>
        </Route>
      </Routes>
     </Router>
    </>
  )
}

export default App
