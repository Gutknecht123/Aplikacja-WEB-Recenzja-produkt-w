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


//create

static createPost(formData){

    
    console.log(formData.get('files'));
    console.log(formData.get('creator'));

    axios({
        method: 'post',
        url: url+'add-post',
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then((res) => {
        console.log(res)
      });

}

//delete

static deletePost(id){

    return axios.delete(`${url}${id}`);

}

}


export default PostService;