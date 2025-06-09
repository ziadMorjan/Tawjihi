import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Provider Routers
import { BrowserRouter } from 'react-router-dom';
//Provider Context Modal
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { LogOutProvider } from './context/LogoutContext';
import { DataCoursesProvider } from './context/DataCourses';
import { NewOldProvider } from './context/NewOldContext';
import { SearchContextProvider } from './context/SearchContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <AuthProvider>
          <LogOutProvider>
            <DataCoursesProvider>
              <NewOldProvider>
                <SearchContextProvider>
                  <App />

                </SearchContextProvider>

              </NewOldProvider>

            </DataCoursesProvider>

          </LogOutProvider>


        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
