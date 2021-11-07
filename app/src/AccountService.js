import axios from 'axios';

const url = "http://localhost:3000/api/register/";

class AccountService{
//create

static createAccount(login, password, email, name, surname){

    return axios.post(url,{

        login,
        password,
        email,
        name,
        surname,
       
    });

}

static loginAccount(){


    return axios.get(url,{




    });


}


}
export default AccountService;