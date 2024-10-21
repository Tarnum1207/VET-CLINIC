import React from "react"
import {BrowserRouter, createBrowserRouter, RouterProvider, useRoutes} from "react-router-dom"

import MainPage from "../pages/landing/index"
import TestPage from "../pages/test/index"

import LoginPage from "../pages/auth/Login/index";
import RegistrationPage from "../pages/auth/Registration/index";

import Layout from "../layouts/default"
import AuthLayout from "../layouts/auth/default";

import PetsPage from "../pages/lk/Pets/index"
import UsersPage from "../pages/lk/Users/index"
import AdministrationPage from "../pages/lk/Administration/index"
import StatPage from "../pages/lk/Stat/index"
import JournalPage from "../pages/lk/Journal/index"
import JournalIdPage from "../pages/lk/Journal/[journal]";
import JournalIdEditPage from "../pages/lk/Journal/[journaledit]";
import CalendarPage from "../pages/lk/Calendar/index"
import ProfilePage from "../pages/lk/Profile/index"
import LkLayout from "../layouts/lk/default";




const routes = createBrowserRouter([
    {
      index: true,
      path: '/',
      element: <MainPage />
    },
    {
        index: true,
        path: '/landing',
        element: <MainPage />
    },
    {
        path: '/test',
        element: <TestPage />
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'registration',
          element: <RegistrationPage />
        }
      ]
    },
    {
      path: '/lk',
      element: <LkLayout />,
      children: [
        {
          path: 'pets',
          element: <PetsPage />
        },
        {
          path: 'users',
          element: <UsersPage />
        },
        {
          path: 'administration',
          element: <AdministrationPage />
        },
        {
          path: 'stat',
          element: <StatPage />
        },
        {
          path: 'journal',
          element: <JournalPage />,
          children: [
            {
              path: ':journal',
              element: <JournalIdPage />
            },
            {
              path: ':journaledit/edit',
              element: <JournalIdEditPage />
            }
          ]
        },
        {
          path: 'calendar',
          element: <CalendarPage />
        },
        {
          path: 'profile',
          element: <ProfilePage />
        }
      ]
    }
  ])

const Router = () => {
    return <RouterProvider router={routes}/>
}
  
export default Router