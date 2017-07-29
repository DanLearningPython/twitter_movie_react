 import axios from "axios";

export default {
  requestTweet: function(after = 0) {
    let url = 'http://localhost:5000?after='+after;

    return axios.get(url)
      .then(response => {
        //console.log(response);
         return {
           tweets: response.data
         };
      })
  }
}