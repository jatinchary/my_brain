import {  Route , Routes } from "react-router-dom"
import SignIn from "./components/pages/Signin"
import SignUp from "./components/pages/Signup"
import MainPage from "./components/pages/MainPage"


const App = () => {
  return (<>
  
    <Routes>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/main" element={<MainPage/>}/>
      {/* <Route path="/signin" element={<SignIn/>}/> */}
    </Routes>
   
    </>
  )
}

export default App