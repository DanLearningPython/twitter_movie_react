import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Average Score'
                    }
                },
                chart: {
                    type: 'spline'
                },
                series: [{
                    name: 'MOVIE',
                    data: [],
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            },
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
            this.scrollToBottom();
        })
        , 1000)
        
    }

    getSeries(tweets) {
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

        return [tweets, series, tweet_count, total_rating];

    }

    scrollToBottom() {
        const node = ReactDOM.findDOMNode(this.refs.tweetsEnd);
        node.scrollIntoView({ behavior: "smooth" });
    }

    render() {
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
                            <div id="tweet-list" className="panel panel-default">
                                <div className="panel-heading" id="accordion">
                                    <div className="input-group">
                                    </div>
                                </div>
                                <div className="panel-collapse collapse in" id="collapseOne">
                                    <div className="panel-body">
                                        <ul className="chat">
                                            {this.state.tweets && this.state.tweets.map(function (tweet, i) {
                                                let sentiment_color = 'positive';
                                                console.log(tweet.sentiment.positive);
                                                if(tweet.sentiment.positive > .70){
                                                    sentiment_color = 'positive';
                                                }else if(tweet.sentiment.positive > .50){
                                                    sentiment_color = 'neutral';
                                                }else{
                                                    sentiment_color = 'negative';
                                                }
                                                return (
                                                <li key={i} className="right clearfix">
                                                <div className="chat-body">
                                                    <div className="header timestamp">
                                                        <small className="text-muted"><span className="glyphicon glyphicon-time">[{moment(tweet.timestamp).format("ddd,MMM Do-h:mm:ssa")}]</span></small>
                                                    </div>
                                                    <p className="tweet">
                                                        <span className={"sentiment "+sentiment_color}>
                                                           <strong>[{tweet.sentiment.positive}] -&nbsp; </strong>
                                                        </span>
                                                        {tweet.tweet}

                                                    </p>
                                                </div>
                                                </li>
                                                );
                                               
                                            })}
                                        </ul>
                                        <span ref="tweetsEnd" id="tweetsEnd">Waiting for more tweets</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={6} md={4}>
                            
                            <div className="panel panel-default">
                                <div className="panel-heading" id="accordion">
                                    <div className="input-group">
                                    </div>
                                </div>
                                <div className="panel-collapse collapse in" id="collapseOne">
                                    <div className="panel-body">
                                        <h4>Avg Sentiment : {Math.round(this.state.sentiment * 100) / 100}</h4>
                                        <h4>Number of Tweets : {this.state.tweet_count}</h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <footer className="footer">
                  <div className="container">
                    <p className="text-muted">Front end - React; Twitter Bootstrap</p>
                    <p className="text-muted">Back end - Python (Flask); Kafka (Data Ingestion); Twitter Stream API; MongoDB</p>
                  </div>
                </footer>
            </div>
        );
    }
}

export default App;
