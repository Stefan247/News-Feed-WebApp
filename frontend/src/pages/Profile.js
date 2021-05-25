import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style/Profile.scss';
import { useTranslation } from "react-i18next";


export function Profile() {
    const { t } = useTranslation();
    let { _id } = useParams();
    const [username, set_username] = useState('');
    const [email, set_email] = useState('');
    const [role, set_role] = useState('');
    const [nr_posts, set_nr_posts] = useState(0);

    useEffect(() => {
        axios.get(`/api/v1/users/${ _id }`).then((response) => {
            set_username(response.data.username);
            set_email(response.data.email);
            set_role(response.data.role);
        }).catch((err) => {
            alert(err);
        });

        axios.get(`/api/v1/posts/user/${ _id }`).then((response) => {
            set_nr_posts(response.data.nr_posts);
        }).catch((err) => {
            alert(err);
        })
    }, [_id]);

    return (
        <div className="profilePage">
            <div className="card">
                <div className="title">
                    <div className="name">
                        {username}
                    </div>
                    <div className="profilePicture">
                        
                    </div>
                </div>
                <div className="info">
                    <h2>
                        {t('role')}: {role}
                    </h2>
                    <h4>
                        {t('number_of_posts')}: {nr_posts}
                    </h4>
                    <h4>
                        Contact: {email}
                    </h4>
                </div>
            </div>
            <div className="profilePosts">
            </div>
            <div className="profileListOf">

            </div>
        </div>
    )
}
