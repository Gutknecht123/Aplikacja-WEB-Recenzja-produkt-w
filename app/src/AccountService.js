import axios from 'axios';

const url = "http://localhost:3000/api/accounts/";

class AccountService{
//create

static createAccount(login, password, email, name, surname){

    let loginUp = login.toUpperCase();

    return axios.post(url+"register",{

        login,
        loginUp,
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

static getuserAccount(user, token){

    //return axios.get(url,{ params })
    console.log(token);
    console.log(user);
    return axios.get(url+"user",
    {
        params:{user, token}
    },
    {
        headers:{

            "Authorization": `Bearer ${token}`
            
        }
    });
    

}

static getAccounts(token){

    return new Promise ((resolve,reject) => {
        axios.get(url+"users",{params: {token}}).then((res) => {
            const data = res.data;
            resolve(
                data.map(acc => ({
                    ...acc,
                    createdAt: new Date(acc.createdAt)
                }))
            );
        })
        .catch((error)=> {
            reject(error);
        })
        
    });

}

static Captcha(res){

    return axios.post(url+"/captcha",{
        res: res
    })

}

static async checkLogin(login){

    return await axios.get(url+"/checklogin",{
        params:{login}
    })

}

static checkEmail(email){

    return axios.get(url+"/checkemail",{
        params:{email}
    })

}

static getUsername(user){

    return axios.get(url+"/username/"+user,{})

}

}
export default AccountService;