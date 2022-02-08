import axios from 'axios';

//const url = "http://localhost:3000/api/follows/";
const url = "http://192.168.1.12:3000/api/follows/"
class ProfileService{


static getFollows(user){

    return axios.get(url+"getfollows/"+user,{});

}


static Follow(user, followuser){

    console.log(user + ' ' + followuser);

    return axios.post(url+"addfollow", {

        user,
        followuser

    });



}

static Unfollow(user, followuser){


    return axios.post(url+"unfollow",{
        user,
        followuser
    })

}


static Check(user, username){

    console.log(username);
return new Promise ((resolve,reject) => {
    axios.get(url+"checkfollow",{
        params:{
            user,
            username
        }
    }).then((res) => {

        const data = res.data;

        resolve(data);

    }).catch((error)=> {
        reject(error);
    });
});

}


}
export default ProfileService;