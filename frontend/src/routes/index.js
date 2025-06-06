import { Navigate } from "react-router-dom";
import { lazy } from "react";

// Components
import { LoginForm } from "../features/components/LoginForm";
import { RegisterForm } from "../features/components/Register";
import { ForgetPassword } from "../features/components/ForgetPassword";
import { VerificationCode } from "../features/components/VerificationCode";
import { ResetPassword } from "../features/components/ResetPassword";

// Pages (lazy loaded)
const Main = lazy(() => import("../pages/Main"));
const About = lazy(() => import("../pages/About"));
const Auth = lazy(() => import("../pages/Auth"));
const OAuthSuccess = lazy(() => import("../features/components/OAuthSuccess"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const PATH = {
    Main: "/",
    About: "about",
    Auth: "auth",
    Login: "auth/login",
    Register: "auth/register",
    ForgetPassword: "forget-password",
    VerificationCode: "verification-code",
    ResetPassword: "reset-password",
};

export const routers = [
    { index: true, element: <Main /> },
    { path: PATH.About, element: <About /> },
    { path: PATH.ForgetPassword, element: <ForgetPassword /> },
    { path: PATH.VerificationCode, element: <VerificationCode /> },
    { path: PATH.ResetPassword, element: <ResetPassword /> },

    {
        path: PATH.Auth,
        element: <Auth />,
        children: [
            { index: true, element: <Navigate to="login" /> },
            { path: "login", element: <LoginForm /> },
            { path: "register", element: <RegisterForm /> },
        ],
    },

    { path: "oauth-success", element: <OAuthSuccess /> },

    { path: "*", element: <NotFound /> },
];
