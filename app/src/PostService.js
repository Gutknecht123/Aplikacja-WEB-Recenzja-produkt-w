import axios from 'axios';

const url = "http://localhost:3000/api/posts/";

class PostService{

//get
    static getPosts(){
        return new Promise ((resolve,reject) => {
            axios.get(url).then((res) => {
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

    static getUserPosts(user){
        return new Promise ((resolve,reject) => {
            axios.get(url+"get/"+user).then((res) => {
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

    //const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)

    //formData.append('filename', filename);
    //console.log(formData.get('files'));
   // console.log(formData.get('creator'));

   /*
  return axios({
    method: 'post',
    url: 'http://localhost:3000/api/upload',
    data: formData,
    headers: {
        "Content-Type": "multipart/form-data"
    }
    }).then((res) => {
    console.log(res)

        axios.post(url+'add-post', {

        creator,
        text,
        category,
        stars,
        media,
        likes: '0',
        filename,
        files

         })

    }); 
    */

    const res = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/posts/add-post',
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    console.log(res); 
}

//delete

static deletePost(id){

    return axios.delete(`${url}${id}`);

}

}


export default PostService;