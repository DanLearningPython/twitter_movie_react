import React, { Component } from 'react';
import Highcharts from 'highcharts';

export class LineGraph extends Component {

    constructor(props) {
      super(props);
      let config = props.config
        this.state = {
            config : config
        };
      }  
    
  
    componentDidMount() {
        this.chart = new Highcharts[this.props.type || "Chart"](
            this.refs.chart,
            this.state.config
        );
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    componentWillReceiveProps(newProps) {
        console.log("graph new props");
        console.log(newProps);
      this.chart.series[0].update({
          ...newProps.config.series[0]
      });
        this.setState({
            ...this.state,
            config : newProps.config
        });
    }

    render() {
        return (
            <div ref="chart"/>
        )
    }
}