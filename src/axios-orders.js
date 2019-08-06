import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger1-b0ed3.firebaseio.com/'
});

export default instance;