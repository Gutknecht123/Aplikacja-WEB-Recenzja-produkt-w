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
        surname,
       
    });

}

static loginAccount(login, password){

    //return axios.get(url,{ params })

    return axios.post(url+"login",{

        login,
        password

    });
    


    

}


}
export default AccountService;