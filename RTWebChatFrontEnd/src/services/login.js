import axios from 'axios';
const baseUrl = '/api/login';

const login = async credentails => {
    const response = await axios.post(baseUrl, credentails)
    return response.data
}

export default { login }