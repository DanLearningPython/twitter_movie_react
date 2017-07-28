 import axios from "axios";

export default {
  requestTweet: function(after) {
    return axios.get('http://localhost:5000')
      .then(response => {
        console.log(response);

         return {
           tweets: response.data
         };
      })
  }
}