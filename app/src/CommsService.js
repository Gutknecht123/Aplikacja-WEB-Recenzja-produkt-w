import axios from 'axios';

const url = "http://localhost:3000/api/comments/";

class CommsService{

//get
static getComments(id){
    return new Promise ((resolve,reject) => {
        axios.get(url+"get/"+id).then((res) => {
            const data = res.data;
            resolve(
                data.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt)
                }))
            );
        })
        .catch((error)=> {
            reject(error);
        })
        
    });
}






}

export default CommsService;