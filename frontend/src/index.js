//react
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

//style
import './index.css';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './global/GlobalStyle';

//toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { AppContext, AppProvider } from './context/WishAndCartListContext';
import { CommentsProvider } from './context/CommentContext';


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
                            <AppProvider>
                              <ToastContainer
                                position="center"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={true} // since you use Arabic text
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                              />           
                              <CommentsProvider>         
                              
                              <App />

                              </CommentsProvider>
                            </AppProvider>
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
