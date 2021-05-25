import React from 'react';
import './style/Home.scss';
import './style/App.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { useContext } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';


export function Home() {
    const [list_of_posts, set_list_of_posts] = useState([]);
    let history = useHistory();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get('/api/v1/posts').then((response) => {
            set_list_of_posts(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const like_post = (postId) => {
        axios.post('/api/v1/likes',
        { 
            postId: postId
        },
        { 
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        }
        ).then((response) => {
            if(authState.status) {
                set_list_of_posts(list_of_posts.map((post) => {
                    if (post._id === postId) {
                        if (response.data.liked) {
                            return {...post, likes: [...post.likes, '']};
                        } else {
                            const arr = post.likes;
                            arr.pop();
                            return {...post, likes: arr};
                        }
                    } else {
                        return post;
                    }
                }));
            }
        })
    }

    const get_profile = (username) => {
        axios.get(`/api/v1/users/idByName/${username}`).then((response) => {
            history.push(`/profile/${response.data}`);
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="homePage">
            {list_of_posts.slice(0).reverse().map((value, key) => {
                return(
                    <div key={key} className="post">
                        <div className="title" onClick={() => {history.push(`/posts/${value._id}`)}}>
                            {value.title}
                        </div>
                        <div className="content">
                            {value.content}
                        </div>
                        <div className="footer">
                            <div className="author" onClick={() => {get_profile(value.username)}}>
                            {value.username}
                            </div>
                            <div className="date">
                                {value.date.slice(0, 10)} | {value.date.slice(11, 16)}
                            </div>
                            <div className="likebar">
                                <FavoriteIcon className="likedButton" onClick={() => {like_post(value._id)}} />
                                <label className="count">{value.likes.length}</label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
