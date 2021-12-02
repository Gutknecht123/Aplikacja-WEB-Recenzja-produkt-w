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

static createPost(creator, text, category, stars, media, formData){

    return axios.post(url,{

        text,
        category,
        likes: 0,
        media,
        formData,
        stars,
        creator

    });

}

//delete

static deletePost(id){

    return axios.delete(`${url}${id}`);

}

}


export default PostService;