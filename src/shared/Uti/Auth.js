import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},    // ✅ lowercase
  logout: () => {},
  userId: null,
  token: null,
  userName:null

});




//The logic behind this auth context is as follows firstly we iniallize  the create context by assigning it to the AuthContext variable.
// inside the CreateContex we pass in an object inside the object we pass in our authentication logic values;
//Here will have isLoggedIn property which will be our reference for our auth logic is LoggedIn is just like a variable which we are going to use to create our state
//we also have login  and logout functions this is the function that will triger the state so the changes can apply here in the authcontext we pass is an empty funciton because we are going to create real function for it on the app component
//userId is also like a property so that we can also control dynamic Id
// After all this we export the state 

//App component.
//On Our App component which is the root component here will we import this authcontext component and create a state for the isloggedIn variable because we are using token from backend for our validation we call the state token and setToken
//After creating states for the isLoggedIn property we now create this two login and logout function setting the setToken state to true in the login function and null or false in the logout function,
//we Now join everything together on the auth.provider rapper passing in all the functions and the isloggedin variable to connect them together
//We now go the the login and signup component to place the login via auth.login after the onsubmit handler then pass in data from the backend such as token and userId for authentication and dinamic users respectively. once we submit our form to the backend the backend send back a response containing the userId and the token which will extract into the login function as stated before which will instantly change the state of the isloggedIn property.
//Also we create a button on the navbar that will call logout on this button will pass onclick event passing in the logout function from the authcontext
//Note when connecting the functions to the triggers always import the authContext component and the useContext from react and creating a variable calling the usecontext from react as a function and passing the authcontext into it to establish the connection.


//Components that are going to consume this logic.
//now after all the connections have been done it is time to consume the logic 
//firstly import the  useContext and the Auth context and connect them to a variable as discussed above
//now anything you want to display when the state is loggedIn  or !loggedIn you just need to create an object literal and use if else statement or && to render them conditionally checking whether the state of the isloggeIn property is true or false.

//Always keep learning Ebenezer.
