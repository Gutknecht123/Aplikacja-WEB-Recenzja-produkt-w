import axios from 'axios';

const url = "http://localhost:3000/api/profiles/";

class SettingsService {

    static async updateProfile(formData){

        const res = await axios({
            method: 'post',
            url: url+'update',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(res); 

    }

    static getProfile(user){

        return axios.get(url+'/get/'+user,
        {
        });

    }

}

export default SettingsService;