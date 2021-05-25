import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './style/Register.scss';
import { useTranslation } from "react-i18next";


export function Register() {
    const { t } = useTranslation();
    let history = useHistory();

    const initialValues = {
        username: "",
        password: "",
        email: ""
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(4).max(16).required("Username is required (4-16 characters)"),
        password: Yup.string().min(4).max(16).required("Password is required (4-16 characters)"),
        email: Yup.string().required("A valid email is required")
    })

    const onSubmit = (data) => {
        axios.post("/api/v1/users/register", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                history.push('/login');
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="registerPage"> {t('register')}
           <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <div className="registerForm">
                        <label> {t('username')} </label>
                        <ErrorMessage name="username" />
                        <Field autoComplete="off" className="registerFormField" name="username" placeholder="username"/>

                        <label> {t('password')} </label>
                        <ErrorMessage name="password" />
                        <Field type="password" autoComplete="off" className="registerFormField" name="password" placeholder="password"/>

                        <label> Email </label>
                        <ErrorMessage name="email" />
                        <Field autoComplete="off" className="registerFormField" name="email" placeholder="email"/>

                        <label> {t('role')} </label>
                        <Field autoComplete="off" className="registerFormField" name="role" placeholder="ex. User, Admin, Support"/>

                        <Button className="registerButton" variant="contained" color="primary" type="submit">{t('register')}</Button>
                    </div>
                </Form>
            </Formik> 
        </div>
    )
}
