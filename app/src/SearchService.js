import axios from 'axios';

const url = "http://localhost:3000/api/search/";



class SearchService {


    static async searchCategory(phrase, category, PostCount){

        return new Promise ((resolve,reject) => {
            axios.get(url+"category/"+phrase,{params: {category,PostCount}}).then((res) => {
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

    static async searchTitle(phrase, PostCount){

        return new Promise ((resolve,reject) => {
            axios.get(url+"title/"+phrase,{params: {PostCount}}).then((res) => {
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
    static async getCategories(phrase){

        return axios.get(url+"categories/"+phrase);

    }
    static searchUsername(phrase){

        return axios.get(url+"/username/"+phrase,{});
    
    }


}
export default SearchService;