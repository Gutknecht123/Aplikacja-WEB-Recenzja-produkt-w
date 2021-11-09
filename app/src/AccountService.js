import axios from 'axios';

const url = "http://localhost:3000/api/accounts/";

class AccountService{
//create

static createAccount(login, password, email, name, surname){

    return axios.post(url+"register",{

        login,
        password,
        email,
        name,
        surname
       
    });

}

static loginAccount(login, password){

    //return axios.get(url,{ params })

    return axios.post(url+"login",{

        login,
        password

    },{
        withCredentials: true
    });

}

static getuserAccount(){

    //return axios.get(url,{ params })

    return axios.get(url+"user",
    {
        withCredentials: true,
        headers:{
            'Content-Type': 'application/json'
        }
    });


}

static logoutAccount(){

    return axios(url+'logout',
    {
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
          },
        credentials: 'include'
    });

}

}
export default AccountService;