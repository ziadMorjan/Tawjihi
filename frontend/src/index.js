import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './global/GlobalStyle';

// Context Providers
import { ThemeContextProvider, ThemeContext } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { LogOutProvider } from './context/LogoutContext';
import { DataCoursesProvider } from './context/DataCourses';
import { NewOldProvider } from './context/NewOldContext';
import { SearchContextProvider } from './context/SearchContext';
import { SideBarContextProvider } from './context/SideBarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <ModalProvider>
                <SideBarContextProvider>

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
                </SideBarContextProvider>
              </ModalProvider>
            </ThemeProvider>
          )}
        </ThemeContext.Consumer>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
