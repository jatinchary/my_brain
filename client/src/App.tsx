import {  Route , Routes } from "react-router-dom"
import SignIn from "./components/pages/Signin"
import SignUp from "./components/pages/Signup"
import MainPage from "./components/pages/MainPage"
import ProtectedRoute from "./components/pages/ProtectedRoute"
import LandingPage from "./components/pages/Landing"


const App = () => {
  return (
    <Routes>
       <Route path="/" element={<LandingPage/>}/> 
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route element={<ProtectedRoute />}>
        <Route path="/main" element={<MainPage/>}/>
      </Route>
    </Routes>
  );
}

export default App