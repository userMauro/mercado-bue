import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound () {
    return (
        <div>
            Not found 404
            <Link to = '/'><button>Home</button></Link>
        </div>
    );
};