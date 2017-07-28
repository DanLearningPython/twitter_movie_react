import React, { Component } from 'react';
import './App.css';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import tweetApi from "./tweetApi";

class App extends Component {

  constructor(props) {
      super(props);

      this.state = {
          tweets : []
      };

  }

  componentDidMount() {
    tweetApi.requestTweet().then(tweets => {
      this.setState(
          {
            ...tweets
          }
        )
    });
  }

  render() {
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
              <NavItem eventKey={1} target="_blank" href="https://github.com/DanLearningPython">Github</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.state.tweets && this.state.tweets.map(function(tweet, i) {

            return (
              <div key={i}>
                {tweet.tweet} 
              </div>
            );
        })
        }
      </div>
    );
  }
}

export default App;
