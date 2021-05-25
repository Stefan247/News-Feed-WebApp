import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";


export function PageNotFound() {
    const { t } = useTranslation();
    return (
        <div>
            <h2> - </h2>
            <h1> 
            <Link to="/"> {t('ret_home')} </Link>
            </h1>
        </div>
    )
}
