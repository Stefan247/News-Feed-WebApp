import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './style/ReviewUsers.scss';
import { AuthContext } from '../helpers/AuthContext';
import { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";


export function ReviewUsers() {
    const { t } = useTranslation();
    let history = useHistory();
    const available_roles = ["Admin", "User", "Support"];

    const [list_of_users, set_list_of_users] = useState([]);
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            axios.get('/api/v1/users', {
                headers: {
                    access_token: localStorage.getItem('access_token')
                }
            }).then((response) => {
                set_list_of_users(response.data);
            }).catch((err) => {
                alert(err);
            });
        } else {
            history.push('/');
        }
    }, [history]);

    const get_profile = (username) => {
        axios.get(`/api/v1/users/idByName/${username}`).then((response) => {
            history.push(`/profile/${response.data}`);
        }).catch((err) => {
            alert(err);
        });
    }

    const delete_user = (userId) => {
        if (localStorage.getItem('access_token') && authState.role === "Admin") {
            axios.delete(`/api/v1/users/${userId}`, {
                headers: {
                    access_token: localStorage.getItem('access_token')
                }
            }).then((response) => {
                if (response.data.error) {
                    alert("Delete failed");
                } else {
                    set_list_of_users(list_of_users.filter((value) => {
                        return value._id !== userId;
                    }));
                }
            }).catch((err) => {
                alert(err);
            });
        }
    }

    const change_user_role = (userId, user_role) => {
        if (localStorage.getItem('access_token') && authState.role === "Admin") {
            const new_role = prompt("Insert role (Admin, Support, User)", user_role);
            if (available_roles.includes(new_role)) {
                axios.put(`/api/v1/users/${userId}`, {
                    role: new_role
                },
                {
                    headers: {
                        access_token: localStorage.getItem('access_token')
                    }
                }).then(() => {
                    window.location.reload(); 
                }).catch((err) => {
                    alert(err);
                });
            }
        }
    }

    return (
        <div className="users-page">
            {list_of_users.map((user, key) => {
                if (user.role !== "Admin") {
                    return(
                        <div key={key} className="user-container">
                            <div className="username" onClick={() => {get_profile(user.username)}}>
                                {user.username}
                            </div>
                            <div className="email">
                                {user.email}
                            </div>
                            <div className="role">
                                {user.role}
                            </div>
                            {authState.role === "Admin" &&
                            <div className="role-container">
                                <div className="role-selector">
                                <Button onClick={() => {change_user_role(user._id, user.role)}} className="user-change-button" variant="outlined" color="secondary"> {t('edit_button')} </Button>
                                </div>
                                <Button onClick={() => {delete_user(user._id)}} className="user-delete-button" variant="outlined" color="secondary"> {t('delete_button')} </Button>
                            </div>}
                        </div>
                    );
                }
            })}
        </div>
    );
}
