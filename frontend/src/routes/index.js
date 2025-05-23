//pages
import { lazy } from "react"
import NotFound from "../pages/NotFound"
const Main = lazy(()=>{
return import ("../pages/Main")
})

const About = lazy(()=>{
return import ("../pages/About")
})

export const PATH = {
    Main: '/',
    About : 'about'
}

export const routers = [
    { index: true, element: <Main /> },
    {path : PATH.About , element : <About/>},
      { path: '*', element: <NotFound /> }

]