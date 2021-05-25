import React from 'react';
import './style/Login.scss';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { useTranslation } from "react-i18next";


export function Login() {
    const { t } = useTranslation();
    let history = useHistory();
    const { setAuthState } = useContext(AuthContext);

    const initialValues = {
        username: "",
        password: ""
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(`${t('username_req')}`),
        password: Yup.string().required(`${t('password_req')}`)
    })

    const onSubmit = (data) => {
        axios.post('/api/v1/users/login', data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem('access_token', response.data.access_token);
                setAuthState({
                    username: response.data.username,
                    _id: response.data._id,
                    status: true,
                    role: response.data.role
                  });
                history.push('/');
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className ="loginPage"> {t('login')}
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <div className="loginForm">
                        <label> {t('username')} </label>
                        <ErrorMessage name="username" />
                        <Field  autoComplete="off"className="loginFormField" name="username" placeholder="username"/>

                        <label> {t('password')} </label>
                        <ErrorMessage name="password" />
                        <Field type="password" autoComplete="off" className="loginFormField" name="password" placeholder="password"/>

                        <Button className="loginButton" variant="contained" color="primary" type="submit">{t('login')}</Button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}
