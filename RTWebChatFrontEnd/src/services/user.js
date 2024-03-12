import axios from 'axios';
const baseUrl = '/api/users/';

let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`;
}

const create = async newUser => {
    const response = await axios.post(baseUrl, newUser);
    return response.data;
}

const getUsers = async () => {
	const response = await axios.get(baseUrl);
	return response.data	
}

export default { create, setToken, getUsers };
