import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { Chart } from 'primereact/chart';

export default class ExtraChart extends Component {



    render() {
        let chart = <div/>;
        let {settings, hoveredFeature} = this.props;
        switch (this.props.datasetSelected) {
            case 'residents':
            

                let data = {
                    labels: ['Female', 'Male'],
                    datasets: [
                        {
                            data: [hoveredFeature.properties.female, hoveredFeature.properties.male],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                            ]
                        }]
                };

                chart = (
                    <div>
                        <Chart type="doughnut" data={data} />
                    </div>);
                break;
            /*
          case 'food_and_vet':
            break;
          case 'average_earnings':
            hoverComponent = (
              <div><div>Municipality: {hoveredFeature.properties.longName}</div>
                <div>Average Earnings year 2015: £{hoveredFeature.properties.average_earnings_monthly_eur}</div></div>);
            break;
          case 'foreign_investment':
            hoverComponent = (
              <div><div>Municipality: {hoveredFeature.properties.longName}</div>
                <div>Foreign direct investment: £{hoveredFeature.properties.value}</div></div>);
            break;
          case 'investment_tangible':
            hoverComponent = (
              <div><div>Municipality: {hoveredFeature.properties.longName}</div>
                <div>Investment in tangible fixed assets: £{hoveredFeature.properties.value}</div></div>);
            break;
          case 'economic_entities':
            hoverComponent = (
              <div><div>Municipality: {hoveredFeature.properties.longName}</div>
                <div>Economis entitites in operation: {hoveredFeature.properties.value}</div></div>);
            break;
      
      
          default:
          // code block
          */
        }

        return chart;

    }

}