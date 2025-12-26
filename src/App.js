import "./App.css";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Updateplace from "./places/pages/Updateplace";
import User from "./users/pages/User";
import Place from "./places/pages/Place";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Newplace from "./places/pages/Newplace";
import Signup from "./users/pages/Signup";
import Login from "./users/pages/Login";
import { AuthContext } from "./shared/Uti/Auth";
import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
let logoutTimer;
function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenexpirationDate, setTokenexpirationDate] = useState()
  const [userName, setUserName] = useState(null);

//From the code  below the token will be send from the backend to the signup or login component from their the token is past to this function via parameter which is now pass to the setToken state which we now join to the isLoggedIn variable on the auth context
  const login = useCallback((uid, token, userName, expirationDate) => {
  setToken(token);
  setUserId(uid);
  setUserName(userName);

  const tokenExpiration =
    expirationDate instanceof Date
      ? expirationDate
      : new Date(expirationDate || new Date().getTime() + 1000 * 60 * 60);

  setTokenexpirationDate(tokenExpiration);
//storing data in the local storage so that when the page is refreshed the data will not be lost
  localStorage.setItem(
    "userData",
    JSON.stringify({
      userId: uid,
      token: token,
      userName: userName,
      expiration: tokenExpiration.toISOString()
    })
  );
}, []);


  const logout = useCallback(() => {
    setToken(null); // clearing setToken when the logout button is pressed
    setUserName(null) // clearing userName when the logout button is pressed
    setUserId(null) // clearing userId when the logout button is pressed
    setTokenexpirationDate(null) // here we are trying to clear the state of tokenexpiration when the logout button is pressed
    localStorage.removeItem('userData')
  }, []);
  useEffect(() => {
    if (token && tokenexpirationDate){
      //the reason for the code bellow is because setimeout cannot take in a state variable directly as the time limit it has to be a number value
      //that is the reason why we convert the time received from the tokenexpiration state to time in milli seconds and we subract the current time from the remaining expiration time to know the time that is remaining for the token to expire
      // getTime is a built in method that helps convert time to miliseconds
      const remainingTime = tokenexpirationDate.getTime() - new Date().getTime()
      //setTimeout is a javascript built in function that triggers periodically, on our code below will use to auto logout when the token expiration time is reached.
      //it usually takes two parameter one for what will happen when the time is reached(logout), the other for the time limit for the event to happen(remainingTime)
    logoutTimer =  setTimeout(logout, remainingTime)
    }else{
      // this line of code means if we are not logged in there should not be a timer
      clearTimeout(logoutTimer)
    }
  }, [logout, token, tokenexpirationDate])
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')) // to retreive the token and the userId from the local storage and pass it in to the login function after every refresh to prevent the system from authomatically logging users out
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
      login(storedData.userId, storedData.token, storedData.userName, new Date(storedData.expiration)) //here we pass the token, expiration and userId in
    }
  }, [login])
  let routes
  if(token){
    
    routes = (
      <Switch>
     <Route path="/" exact>
          <User />
         </Route>
         <Route path="/:userid/places" exact>
         <Place />
         </Route>
         <Route path="/places/new">
          <Newplace />
           </Route>
            <Route path="/places/:pid">
           <Updateplace />
          </Route>
          <Redirect to="/" />
            </Switch>
    )
   
  } else{
    routes = (
      <Switch>
          <Route path="/:userid/places" exact>
         <Place />
         </Route>
      <Route path="/" exact>
          <User />
         </Route>
         <Route path="/signup">
            <Signup />
             </Route>
             <Route path="/login">
             <Login />
            </Route>
            <Redirect to="/" />
              </Switch>
    );
 
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn:!!token, 
    login: login, 
    logout: logout,
    userId: userId,
    token:token, // do not usually neccessary
    userName: userName
    }}>
      <Router>
        <Box bg="#1A202C" minH="100vh" color="white" m="0" p="0">
          <MainNavigation />
          <Box as="main" pt="80px">
           {routes}
          </Box>
        </Box>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
