import axios from 'axios';
const baseUrl = '/api/users/';

let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`;
}

const create = async newUser => {
    const response = await axios.post(baseUrl, newUser);
    console.log(response.data)
    return response.data;
}

export default { create, setToken };