import React from 'react';
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { Post } from './pages/Post';
import { PageNotFound } from './pages/PageNotFound';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { ReviewUsers } from './pages/ReviewUsers';
import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "login": "Login",
          "home": "Home",
          "register": "Register",
          "create_post": "Create a Post",
          "review_users": "Review Users",
          "logout": "Logout",
          "title_req": "Title is required",
          "content_req": "Post content is required",
          "username_req": "Username is required",
          "password_req": "Password is required",
          "title": "Title",
          "content": "Content",
          "post_button": "Post",
          "username": "Username",
          "password": "Password",
          "ret_home": "Return home",
          "delete_button": "Delete",
          "edit_button": "Edit",
          "add_comment": "Send",
          "role": "Role",
          "number_of_posts": "Number of posts"
        }
      },
      ro: {
        translation: {
          "login": "Intră în cont",
          "home": "Acasă",
          "register": "Înregistrare",
          "create_post": "Creează o postare",
          "review_users": "Listă utilizatori",
          "logout": "Ieși din cont",
          "title_req": "Titlul este necesar",
          "content_req": "Conținutul este necesar",
          "username_req": "Nume utilizator necesar",
          "password_req": "Parola este necesară",
          "title": "Titlu",
          "content": "Conținut",
          "post_button": "Trimite",
          "username": "Nume utilizator",
          "password": "Parolă",
          "ret_home": "Înapoi acasă",
          "delete_button": "Șterge",
          "edit_button": "Editează",
          "add_comment": "Trimite",
          "role": "Rol",
          "number_of_posts": "Număr de postări"
        }
      }
    },
    lng: document.querySelector('html').lang,
    fallbackLng: "en",
    detection: {
      order: ['htmlTag', 'path'],
    },
    interpolation: {
      escapeValue: false
    }
  });


function App() {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState({
    username: "",
    _id: 0,
    status: false,
    role: ""
  });

  useEffect(() => {
    axios.get('/api/v1/users/auth/check', { 
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState({...authState, status: false});
      } else {
        setAuthState({
          username: response.data.username,
          _id: response.data._id,
          status: true,
          role: response.data.role
        });
      }
    })
  }, []);

  const logout = async () => {
    localStorage.removeItem('access_token');
    setAuthState({
      username: "",
      _id: 0,
      status: false,
      role: ""
    });
  }

  const change_language = async (lng) => {
    document.documentElement.setAttribute('lang', lng);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <BrowserRouter>
        <div className="topnav">
          <Link to="/"> {t('home')} </Link>
          {!authState.status ? (
            <>
              <Link to="/login"> {t('login')} </Link>
              <Link to="/register"> {t('register')} </Link>
            </>
          ) : (
            <>
              {authState.role !== "User" && <Link to="/createpost"> {t('create_post')} </Link>}
              <button onClick={logout}> {t('logout')} </button>
            </>
          )}
          {authState.status && authState.role === "Admin" && <Link to="/reviewusers"> {t('review_users')} </Link>}
        <div className="myInfo">
          <div className="myName">
            {authState.username}
          </div>
          <div className="myRole">
            {authState.role}
          </div>
        </div>
        </div>
          <Switch>
            <Route path="/" exact component={ Home } />
            <Route path="/createpost" exact component={ CreatePost } />
            <Route path="/posts/:_id" exact component={ Post } />
            <Route path="/register" exact component={ Register } />
            <Route path="/login" exact component={ Login } />
            <Route path="/profile/:_id" exact component={ Profile } />
            <Route path="/reviewusers" exact component={ ReviewUsers }/>
            <Route path="*" exact component={ PageNotFound } />
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>

      <div className="footernav">
        <Button onClick = {() => {change_language("en")}} className="edit-lang" variant="outlined" color="primary"> EN </Button>
        PW 2021 Project
        <Button onClick = {() => {change_language("ro")}} className="edit-lang" variant="outlined" color="primary"> RO </Button>
      </div>
    </div>
  );
}

export default App;
