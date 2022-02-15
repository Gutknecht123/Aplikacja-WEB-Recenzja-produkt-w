import axios from 'axios';

//const url = "http://localhost:3000/api/posts/";
const url = "http://192.168.1.12:3000/api/posts/"
class PostService{

//get
    static getPosts(PostCount){
        return new Promise ((resolve,reject) => {
            axios.get(url,{params: {PostCount}}).then((res) => {
                const data = res.data;
                resolve(
                    data.map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                );
            })
            .catch((error)=> {
                reject(error);
            })
            
        });
    }

    static getUserPosts(user, PostCount){
        return new Promise ((resolve,reject) => {
            axios.get(url+"get/"+user,{params: {PostCount}}).then((res) => {
                const data = res.data;
                console.log(data);
                resolve(
                    data.map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                );
            })
            .catch((error)=> {
                reject(error);
            })
            
        });
    }

    static getfollowsPosts(follows, PostCount){

        console.log("tutaj");

        
        return new Promise ((resolve,reject) => {
            axios.get(url+"followings",{params: {follows, PostCount}}).then((res) => {
                const data = res.data;
                resolve(
                    data.map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                );
            })
            .catch((error)=> {
                reject(error);
            })
            
        });
        


        

    }

//create

static async createPost(formData){
    
    await axios({
        method: 'post',
        url: url+'add-post',
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    
}

static async editPost(postid, formData){
    await axios({
        method: 'post',
        url: url+'editpost/'+postid,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

//delete

static deletePost(id){

    return axios.delete(`${url}${id}`);

}

static Like(postid, username){

    return axios.post(url+"like/"+postid,{
        username
    })                   
}

static unLike(postid, username){

    return axios.post(url+"dislike/"+postid,{
        username
    })                   
}

static GetLikes(postid){

    return axios.get(url+"likes/"+postid);                
}

static getAdminPosts(PostCount){

    return new Promise ((resolve,reject) => {
        axios.get(url+'/admin',{params: {PostCount}}).then((res) => {
            const data = res.data;
            resolve(
                data.map(post => ({
                    ...post,
                    createdAt: new Date(post.createdAt)
                }))
            );
        })
        .catch((error)=> {
            reject(error);
        })
        
    });
}


}

export default PostService;