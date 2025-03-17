import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtAxios from '../../util/jwtUtil';

const Test = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await jwtAxios.get('http://localhost:8090/api/test');
                setData(response.data.admin);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData('접근 권한이 없습니다.');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>{data}</h1>
        </div>
    );
};

export default Test;
