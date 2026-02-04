import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./components/Header.js"
import Landing from "./pages/Landing.js"
import Interview from "./pages/Interview.js"

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
    </Router>
  );
}

export default App;
