//react
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

//style
import './index.css';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './global/GlobalStyle';

//start
import App from './App';

// Context Providers
import { ThemeContextProvider, ThemeContext } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { LogOutProvider } from './context/LogoutContext';
import { DataCoursesProvider } from './context/DataCourses';
import { NewOldProvider } from './context/NewOldContext';
import { SearchContextProvider } from './context/SearchContext';
import { SideBarContextProvider } from './context/SideBarContext';
import { WishListProvider } from './context/WishListContext';


//start point
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
                            <WishListProvider>
                              <App />
                            </WishListProvider>
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
