import axios from 'axios';

//const url = "http://localhost:3000/api/comments/";
const url = "http://192.168.1.12:3000/api/comments/"
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


static addComment(postID, comment, creator){

    return axios.post(url+"add", {

        postID,
        comment,
        creator

    });

}

static deleteComment(id, commid){

    return axios.post(url+"dellcomm",{

        id,
        commid

    });

}

}

export default CommsService;