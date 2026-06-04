// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './features/auth';
import Home         from './pages/Home';
import Courses      from './pages/Courses';
import Login        from './pages/Auth/Login';
import Register     from './pages/Auth/Register';
import OAuthSuccess from './pages/Auth/OAuthSuccess';

import CourseDetails    from './pages/CourseDetails';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/courses"           element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/auth/login"        element={<Login />} />
        <Route path="/auth/register"     element={<Register />} />
        <Route path="/oauth-success"     element={<OAuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}