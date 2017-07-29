import React, {Component} from 'react';
import './App.css';
import {Button, Navbar, Nav, NavItem, Col, Grid, Row} from 'react-bootstrap';
import tweetApi from "./tweetApi";
import _ from 'lodash'
import {LineGraph} from './LineGraph';
import moment from "moment";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sentiment : 0.5,
            tweet_count : 0,
            total_rating : 0,
            timestamp : 0,
            tweets: [],
            config: {
                title: {
                    text: 'Movie Sentiment'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: 'Average Score'
                    }
                },
                chart: {
                    type: 'line'
                },
                series: [{
                    name: 'MOVIE',
                    data: [],
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            }
        };

    }

    componentDidMount() {

        let timer = setInterval(()=>tweetApi.requestTweet(this.state.timestamp).then(tweets => {
            if(tweets.length === 0){
                //no data
                return false;
            }else{
                return this.getSeries(tweets);
            }
        }).then(tweets_formatted => {
            if(tweets_formatted[0].length === 0){
                //no data
                return false;
            }
            let last_timestamp = tweets_formatted[1][tweets_formatted[1].length-1][0];
            let sentiment_average =  tweets_formatted[3]/tweets_formatted[2];

            this.setState({
                ...this.state,
                tweets: this.state.tweets.concat(tweets_formatted[0]),
                sentiment: sentiment_average,
                tweet_count : tweets_formatted[2],
                total_rating: tweets_formatted[3],
                timestamp : last_timestamp,
                config : {
                    ...this.state.config,
                    series:{
                        [0] :{
                            ...this.state.config.series[0],
                            data : tweets_formatted[1]
                        }
                        
                    }
                }
            })

        })
        , 10000)

        //let00 timer0 = setInterval(()=> this.getTweets(), 1000)


    }

    getSeries(tweets) {
        console.log("get series");
        console.log(tweets);
        tweets = tweets.tweets;
        let series = _.cloneDeep(this.state.config.series[0].data);
        let tweet_count = this.state.tweet_count;
        let total_rating = this.state.total_rating;

        
        for(let i = 0 , l = tweets.length ; i < l ; i++){
            tweet_count++;
            total_rating = total_rating + tweets[i].sentiment.positive;
            let average = total_rating/tweet_count;
            series.push([tweets[i].timestamp, average]);
        }
        console.log('new series');
        console.log(series);

        return [tweets, series, tweet_count, total_rating];

        //let last_timestamp = tweets[tweets.length-1].timestamp;
        //console.log(last_timestamp);
        
/*
        this.setState({
            ...this.state,
            config:{
                ...this.state.config,
                ...series
            }
        });
*/

    }

    render() {
        console.log("state");
        console.log(this.state);
        return (
            <div className="App">

                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">Movie Tweets</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} target="_blank" href="https://github.com/DanLearningPython">Github
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Grid>
                    <Row className="show-grid">
                        <Col md={12}>
                            <LineGraph config={this.state.config}/>

                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12} md={8}>
                            {this.state.tweets && this.state.tweets.map(function (tweet, i) {

                                return (
                                    <div key = {i} >
                                        <strong>[{moment(tweet.timestamp).format("ddd, MMM Do - h:mm:ss a")}] :</strong>
                                        {tweet.tweet}{tweet.sentiment.positive}
                                    </div >
                                );
                            })}
                        </Col>
                        <Col xs={6} md={4}>
                            <code>&lt;{'Col xs={6} md={4}'} /&gt;</code>
                        </Col>
                    </Row>
                </Grid>


            </div>
        );
    }
}

export default App;
