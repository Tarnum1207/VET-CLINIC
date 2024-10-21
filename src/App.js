import React from "react"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import './styles/App.scss';

// ... импорт компонентов ...
import Layout from "./layouts/default";
import MainPage from "./pages/landing/index"
import TestPage from "./pages/test/index"
import AuthLayout from "./layouts/auth/default"
import LoginPage from "./pages/auth/Login/index"
import RegistrationPage from "./pages/auth/Registration/index"
import LkLayout from "./layouts/lk/default"
import PetsPage from "./pages/lk/Pets/index"
import UsersPage from "./pages/lk/Users/index"
import AdministrationPage from "./pages/lk/Administration/index"
import StatPage from "./pages/lk/Stat/index"
import JournalPage from "./pages/lk/Journal/index"
import JournalIdPage from "./pages/lk/Journal/[journal]/index"
import JournalIdEditPage from "./pages/lk/Journal/[journaledit]/index"
import CalendarPage from "./pages/lk/Calendar/index"
import ProfilePage from "./pages/lk/Profile/index"

const RouterComponent = () => {
    return (
      <PrimeReactProvider className="App">
        <Router>
          <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/landing" element={<MainPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="registration" element={<RegistrationPage />} />
              </Route>
              <Route path="/lk" element={<LkLayout/>}>
                <Route path="pets" element={<PetsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="administration" element={<AdministrationPage />} />
                <Route path="stat" element={<StatPage />} />
                <Route path="journal" element={<JournalPage />}>
                  <Route path=":journal" element={<JournalIdPage />} />
                  <Route path=":journal/edit" element={<JournalIdEditPage />} />
                </Route>
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
          </Routes>
        </Router>
      </PrimeReactProvider>
    );
}
  
export default RouterComponent