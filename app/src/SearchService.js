import axios from 'axios';

const url = "http://localhost:3000/api/search/";



class SearchService {


    static async searchCategory(phrase){

        return new Promise ((resolve,reject) => {
            axios.get(url+"category/"+phrase).then((res) => {
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

    static async searchCreator(phrase){

        return new Promise ((resolve,reject) => {
            axios.get(url+"creator/"+phrase).then((res) => {
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

    static async searchContent(phrase){

        return new Promise ((resolve,reject) => {
            axios.get(url+"content/"+phrase).then((res) => {
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

    static searchUsername(phrase){

        return axios.get(url+"/username/"+phrase,{})
    
    }


}
export default SearchService;