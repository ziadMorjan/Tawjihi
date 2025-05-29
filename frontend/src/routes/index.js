//react
import { Navigate } from "react-router-dom";
import { lazy } from "react"


//components
import { LoginForm } from "../features/components/LoginForm";
import { RegisterForm } from "../features/components/Register";

//pages
const Main = lazy(() => {
    return import("../pages/Main")
})

const About = lazy(() => {
    return import("../pages/About")
})

const Auth = lazy(() => {
    return import("../pages/Auth")
})


const NotFound = lazy(() => {
    return import("../pages/NotFound")
})


export const PATH = {
    Main: '/',
    About: 'about',
    Auth: 'auth',
    Login: "auth/login",
    Register: "auth/register"
}


export const routers = [
    { index: true, element: <Main /> },
    { path: PATH.About, element: <About /> },

    {
        path: PATH.Auth,
        element: <Auth />,
        children: [
            { index: true, element: <Navigate to="login" /> }, // <--- default route
            { path: "login", element: <LoginForm /> },
            { path: "register", element: <RegisterForm /> },
        ],
    },

    { path: '*', element: <NotFound /> },
];
