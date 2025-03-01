import React from "react"
import Home from "./components/Home"
import Upload from "./components/Upload"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Search from "./components/Search";
import Login from "./components/Auth";
import Signup from "./components/Signup";
import Auth from "./components/Auth";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    // Add more routes as needed
    {
      path:'/upload',element:<Upload/>
    },{
      path:'/search',element:<Search/>
    },{
      path:'/auth-page',element:<Auth/>
    },{
      path:'/success-page',element:<Search/>
    }
  ])
  return (
    <RouterProvider router={router}>

     <div>
      
     </div>
    </RouterProvider>
   
  )
}

export default App


//npm install tailwindcss@3.4.1 @tailwindcss/vite