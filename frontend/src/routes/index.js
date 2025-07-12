//react
import { Navigate } from "react-router-dom";
import { lazy } from "react";

// Components
import { LoginForm } from "../features/components/LoginForm";
import { RegisterForm } from "../features/components/Register";
import { ForgetPassword } from "../features/components/ForgetPassword";
import { VerificationCode } from "../features/components/VerificationCode";
import { ResetPassword } from "../features/components/ResetPassword";
import TeacherProfile from "../pages/TeacherProfile";
import OneCourse from "../pages/CourseOne";
import MyCourses from "../pages/MyCourses";
import UserProfile from "../pages/MyProfile";
import EditProfile from "../pages/MyProfile/EditProfile";
<<<<<<< HEAD
=======
import ProtectedRoute from "../components/ProtectedRoute";
>>>>>>> 4e33fc47a612efd65af7d38a321da48f07af7923

// Pages (lazy loaded)
const Main = lazy(() => import("../pages/Main"));
const About = lazy(() => import("../pages/About"));
const Auth = lazy(() => import("../pages/Auth"));
const OAuthSuccess = lazy(() => import("../features/components/OAuthSuccess"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Courses = lazy(() => import("../pages/Courses"));
const Teachers = lazy(() => import("../pages/Teachers"))
const WishList = lazy(() => import("../pages/Wishlist"))
const CartList = lazy(() => import("../pages/CartList"));
const VideoPage = lazy(() => import("../pages/CourseOne/VideoPage"));


export const PATH = {
    Main: "/",
    About: "about",
    Courses: "courses",
    CoursesOne: "courses/:name/:id",
    VideoLesson: "courses/:name/:id/video/:videoIndex",


    User: "user",
    Auth: "auth",
    Login: "auth/login",
    Register: "auth/register",
    ForgetPassword: "forget-password",
    VerificationCode: "verification-code",
    ResetPassword: "reset-password",
    Teachers: "teachers",
    TeacherProfile: "teachers/:id",
    WishList: "wishlist",
    CartList: "cartlist",
    MyCourses: "my-courses",
    OAuthSuccess: "oauth-success",
    UserProfile:"user-profile",
    EditProfile: "edit-profile"

    UserProfile: "user-profile",
    EditProfile: "edit-profile"

};

export const routers = [
    { index: true, element: <Main /> },
    { path: PATH.About, element: <About /> },
    { path: PATH.Courses, element: <Courses /> },
    { path: PATH.CoursesOne, element: <OneCourse /> },
    { path: PATH.VideoLesson, element: <VideoPage /> },
    { path: PATH.ForgetPassword, element: <ForgetPassword /> },
    { path: PATH.VerificationCode, element: <VerificationCode /> },
    { path: PATH.ResetPassword, element: <ResetPassword /> },
    { path: PATH.Teachers, element: <Teachers /> },
    { path: PATH.TeacherProfile, element: <TeacherProfile /> },
    { path: PATH.User, element: <TeacherProfile /> },

    // Auth Routes
    {
        path: PATH.Auth,
        element: <Auth />,
        children: [
            { index: true, element: <Navigate to="login" /> },
            { path: "login", element: <LoginForm /> },
            { path: "register", element: <RegisterForm /> },
        ],
    },

    // Protected Routes
    {
        path: PATH.User,
        element: <ProtectedRoute />, // Wrapper
        children: [
            { path: PATH.WishList, element: <WishList /> },
            { path: PATH.CartList, element: <CartList /> },
            { path: PATH.MyCourses, element: <MyCourses /> },
            { path: PATH.UserProfile, element: <UserProfile /> },
            { path: PATH.EditProfile, element: <EditProfile /> },
<<<<<<< HEAD

=======
>>>>>>> 4e33fc47a612efd65af7d38a321da48f07af7923
        ],
    },

    { path: PATH.OAuthSuccess, element: <OAuthSuccess /> },
    { path: "*", element: <NotFound /> },
];