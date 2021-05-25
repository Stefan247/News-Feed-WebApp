import React from 'react';
import './style/App.scss';
import './style/CreatePost.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { useTranslation } from "react-i18next";


export function CreatePost() {
    const { t } = useTranslation();
    let history = useHistory();
    const { authState } = useContext(AuthContext);

    const initialValues = {
        title: "",
        content: "",
        username: "",
        role: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(`${t('title_req')}`),
        content: Yup.string().required(`${t('content_req')}`),
        username: Yup.string()
    })

    const onSubmit = (data) => {
        axios.post('/api/v1/posts', {...data, username: authState.username, role: authState.role},
        {
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        }
        ).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            }
            history.push('/');
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="createPostPage"> {t('create_post')}
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <div className="postForm">
                        <label> {t('title')} </label>
                        <ErrorMessage name="title" />
                        <Field autoComplete="off" className="postFormTitle" name="title" placeholder="ex. Title.."/>

                        <label> {t('content')} </label>
                        <ErrorMessage name="content" />
                        <Field autoComplete="off" className="postFormContent" name="content" placeholder="ex. Today is a nice day.."/>

                        <Button className="postFormButton" variant="contained" color="primary" type="submit"> {t('post_button')} </Button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}
