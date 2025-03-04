import { useState } from "react";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Body from "./components/Body";
import SignUp from "./components/SignUp";
import AuthForm from "./components/AuthForm";
function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<AuthForm/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
