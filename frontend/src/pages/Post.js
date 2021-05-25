import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './style/Post.scss';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useContext } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { useTranslation } from "react-i18next";


export function Post() {
    const { t } = useTranslation();
    let { _id } = useParams();
    let history = useHistory();
    const [postObj, setPostObj] = useState({});
    const [comments, set_comments] = useState([]);
    const [new_comment, set_new_comment] = useState({});
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            axios.get(`/api/v1/posts/${_id}`).then((response) => {
                setPostObj(response.data);
            }).catch((err) => {
                console.log(err);
            });

            axios.get(`/api/v1/comments/${_id}`).then((response) => {
                set_comments(response.data);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            history.push('/');
        }
    }, [_id, authState.status, history]);

    const add_comment = () => {
        axios.post('/api/v1/comments', {
            username: new_comment.username,
            comment_body: new_comment.comment_body,
            postId: _id,
            role: authState.role
        },
        {
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        }
        ).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                const comment_to_add = {_id: response.data._id, username: response.data.username, comment_body: new_comment.comment_body}
                set_comments([...comments, comment_to_add]);
                set_new_comment({comment_body: ""});
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const delete_comment = (commentId) => {
        axios.delete(`/api/v1/comments/${commentId}`,{
            headers: {
                access_token: localStorage.getItem('access_token')
            }
        }).then(() => {
            set_comments(comments.filter((value) => {
                return value._id !== commentId;
            }));
        }).catch((err) => {
            alert(err);
        });
    }

    const delete_post = (postId) => {
        axios.delete(`/api/v1/posts/${postId}`, {
            headers: {
                access_token: localStorage.getItem(`access_token`)
            }
        }).then(() => {
            history.push('/');
        }).catch((err) => {
            alert(err);
        });
    }

    const get_profile = (username) => {
        axios.get(`/api/v1/users/idByName/${username}`).then((response) => {
            history.push(`/profile/${response.data}`);
        }).catch((err) => {
            alert(err);
        });
    }

    const edit_post = () => {
        const new_content = prompt('Edit:', postObj.content);
        if (new_content) {
            axios.put(`/api/v1/posts/${postObj._id}`, {
                content: new_content
            },
            {
                headers: {
                    access_token: localStorage.getItem('access_token')
                }
            }).then((response) => {
                setPostObj({...postObj, content: response.data.content});
            }).catch((err) => {
                alert(err);
            });
        }
    }

    return (
        <div className="postPage">
           <div className="leftSide">
                <div className="title">
                   {postObj.title}
                </div>
                <div className="content">
                    {postObj.content}
                </div>
                <div className="footer">
                        <div className="author" onClick={() => {get_profile(postObj.username)}}>
                            {postObj.username}
                        </div>
                        <div className="footer-buttons">
                        {(authState.username === postObj.username || authState.role === "Admin")
                        && 
                        <>
                        <Button onClick={() => {edit_post()}} className="edit-post-button" variant="outlined" color="secondary"> {t('edit_button')} </Button>
                        <Button onClick={() => {delete_post(postObj._id)}} className="delete-post-button" variant="outlined" color="secondary"> {t('delete_button')} </Button>
                        </>}
                        </div>
                </div>
           </div>
           <div className="rightSide">
                <div className="comment-list">
                    {comments.map((comment, key) => {
                        return (
                        <div key={key} className="comment-container">
                            <div className="comment-author" onClick={() => {get_profile(comment.username)}}>
                                {comment.username}
                            </div>
                            <div className="comment">
                                {comment.comment_body}
                            </div>
                            {(authState.username === comment.username || authState.role === "Admin") 
                            && 
                            <Button onClick={() => {delete_comment(comment._id)}} className="delete-button" variant="outlined" color="secondary"> {t('delete_button')} </Button>}
                        </div>
                        );
                    })}
                </div>
                <form className="comment-input" noValidate autoComplete="off">
                    <div className="comment-body">
                        <TextField 
                        value={new_comment.comment_body} 
                        id="standard-basic" 
                        fullWidth 
                        label="Comment..."
                        onChange={ (event) => { set_new_comment({ comment_body: event.target.value }); }} />
                    </div>
                    <Button onClick={add_comment} className="comment-send" variant="contained" color="primary">{t('add_comment')}</Button>
                </form>
           </div>
        </div>
    )
}
