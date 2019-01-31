import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
import ControlPanel from './control-panel';
import { ProgressBar } from 'react-bootstrap';
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import ExtraChart from './ExtraChart';


import { defaultMapStyle, dataLayer, heatMapLayer } from './map-style.js';
import { updatePercentiles } from './utils';
import { fromJS } from 'immutable';
import { json as requestJson } from 'd3-request';
import geodata from './us-income.json';
import Tooltip from './component_tooltip';
import PlacePin from './place-pin';
import PlaceInfo from './place-info';
import update from 'immutability-helper';
import Footer from './Footer';


import cubiql from './API_calls';


const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWd1c3RpbmdwIiwiYSI6ImNqamg0MTRvdzFtcXcza3AyMjVqaXBnaXQifQ.zYIEEuNYAnN6N1izHTxgog'; // Set your mapbox token here

export default class App extends Component {
  state = {
    mapStyle: defaultMapStyle,
    datasetsOptions: [
      { label: 'Demogrpahics', value: 'residents' },
      { label: false },  //this is a divider
      { label: 'Foreign direct investment', value: 'foreign_investment' },
      { label: 'Investment in tangible fixed assets', value: 'investment_tangible' },
      { label: 'Average Earnings', value: 'average_earnings' },
      { label: 'Economic Entities in Operation', value: 'economic_entities' },
      { label: false },  //this is a divider
      { label: 'Food & Vet Economic Activities', value: 'food_and_vet' }
    ],
    datasetSelected: 'residents',
    markersReady: [],
    popupInfo: null,
    progress: 20,
    datasets: {
      residents: null,
      investment: null,
      income: null
    },
    filters: {
      residents: {
        age: ['PENSION_AGE_POPULATION'],
        gender: ['FEMALES']
      },
      food_and_vet: {
        heatmap: true,
        economic: ['RESTAURANTS_AND_MOBILE_FOOD_SERVICE_ACTIVITIES']
      },
      foreign_investment: {
        year: [2015]
      },
      economic_entities: {
        employee: ['A_0_4_EMPLOYEES']
      },
      fixed_assets : {
        year: ['A_2015']
      }
    },
    year: 2015,
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 55.3410,
      longitude: 24.1955,
      zoom: 7,
      bearing: 0,
      pitch: 0
    }
  };

  componentDidMount() {
    requestJson('Lithuania-60-compress.geojson', (error, response) => {

      if (!error) {
        this._loadData(response);
      }
    });
    //this._loadData(geodata);
  };

  _loadData = (data) => {

    let promises = []; // this array will contain all the promises that will be resolved when API GET is performed OK.

    //Load the Food and Vet dataset

    promises.push(cubiql.getObservationsFilteredByDimension(
      {
        "cube": "dataset_fis",
        "dimensions": {
          "measure_type": "AUX"
        },
        "components": ["economic_activity", "lat", "long", 'paz_data']
      })
      .then(fis => {
        this.setState({
          fis: fis,
          progress: 40,
        }, () => console.log(this.state.fis));
      })
    );


    // Load the average earnings dataset
    promises.push(cubiql.getObservationsFilteredByDimension(
      {
        "cube": "dataset_average_earnings",
        "dimensions": {
          "measure_type": "AVERAGE_EARNINGS_MONTHLY_EUR"
        },
        "components": ["iso", "average_earnings_monthly_eur", "time_period"]
      })
      .then(average_earnings => {
        this.setState({
          average_earnings: average_earnings,
          progress: 50
        });
      })
    );

    this.setState({ data });

    // loads the default data RESIDENT POPULATION

    promises.push(cubiql.getObservationsFilteredByDimension(
      {
        "cube": "dataset_resident_population",
        "dimensions": {
          "measure_type": "RESIDENT_POPULATION_AT_THE_BEGINNING_OF_THE_YEAR_PERSONS",
          //"age": "PENSION_AGE_POPULATION"
        },
        "components": ["resident_population_at_the_beginning_of_the_year_persons", "iso", "sex", 'age']
      })
      .then(residents => {
        this.setState({
          residents: residents,
          progress: 60
        });

      })
    );

    // wait until all promises are resolved, then remove waiting or barprogress


    Promise.all(promises)
      .then(() => {
        console.log("promesas resueltasssss")
        this.setState({
          progress: 100
        });
       
      })
      .catch(() => {
        this.messages.show({severity: 'error', summary: 'Error', detail: 'Communication with cubiql API failed'});
      });


  };

  _updateMapData = () => {

    //based on the state of the filters, setup the mapStyle, redo the geojson file


  }

  _updateSettings = (name, value) => {
    if (name === 'year') {
      this.setState({ year: value });

      const { data, mapStyle } = this.state;
      if (data) {
        updatePercentiles(data, f => f.properties.income[value]);
        const newMapStyle = mapStyle.setIn(['sources', 'incomeByState', 'data'], fromJS(data));
        this.setState({ mapStyle: newMapStyle });
      }
    }
  };

  //This is called by the control panel 
  _updateState = (value) => {
    this.setState(value, () => {
      if (this.state.progress != 100)
      return;
      switch (this.state.datasetSelected) {
        case 'residents':
          this._processResidents();
          break;
        case 'food_and_vet':
          this._processFood();
          break;
        case 'average_earnings':
          this._processEarnings();
          break;
        case 'foreign_investment':
          this._processForeign();
          break;
        case 'economic_entities':
          this._processEconomicEntities();
          break;
          case 'investment_tangible':
          this._processInvestment_tangible();
          break;
          
        default:
        // code block
      }
    });

  }

  _processInvestment_tangible = () => {
    this.setState({
      progress: 50
    });
    cubiql.getObservationsFilteredByDimension(
      {
        "cube": "dataset_fixed_assets",
        "dimensions": {
          "measure_type": "INVESTMENT_IN_TANGIBLE_FIXED_ASSETS_AT_CURRENT_PRICES_EUR_THOUSAND"
        },
        "components": ["iso", "investment_in_tangible_fixed_assets_at_current_prices_eur_thousand", "time_period"]
      })
      .then(fixed_assets => {
        console.log(fixed_assets);
        this.setState({
          fixed_assets: fixed_assets,
          progress: 80
        }, () => {

          let enrichedPolygons = Object.assign({}, this.state.data);
          enrichedPolygons = enrichedPolygons['features']
            .map(pol => {
              let id = pol['properties']['ISO'];
              let polNewData = Object.assign({}, this.state.fixed_assets.cubiql.dataset_fixed_assets.observations.page);

              polNewData = polNewData.observation.filter(obs => {
                let filter = this.state.filters.fixed_assets.year.includes(obs.time_period);
                return (
                  (obs.iso == id.replace('-', '_')) && filter);
              });
              pol['properties']['investment_in_tangible_fixed_assets_at_current_prices_eur_thousand'] = polNewData[0].investment_in_tangible_fixed_assets_at_current_prices_eur_thousand;
              return pol;
            });
          // data has the geojson file for lithuiania. Depending on the seetings we need to update the geojson file to display the variables we want
          let auxData = {
            "type": "FeatureCollection",
            features: enrichedPolygons
          }
          //this.setState({data:auxData});
          updatePercentiles(auxData, f => f.properties.investment_in_tangible_fixed_assets_at_current_prices_eur_thousand);
          const mapStyle = defaultMapStyle
            // Add geojson source to map
            .setIn(['sources', 'residents'], fromJS({ type: 'geojson', data: auxData }))
            // Add point layer to map
            .set('layers', defaultMapStyle.get('layers').push(dataLayer));

          this.setState({ mapStyle, progress: 100 }, console.log(this.state));

        });
      })




  }
  _processEconomicEntities = () => {
    this.setState({
      progress: 50
    });
    cubiql.getObservationsFilteredByDimension(
      {
        "cube": "dataset_economic_entitites",
        "dimensions": {
          "measure_type": "ECONOMIC_ENTITIES_IN_OPERATION_AT_THE_BEGINNING_OF_THE_YEAR_UNITS"
        },
        "components": ["iso", "economic_entities_in_operation_at_the_beginning_of_the_year_units", "time_period", "employee_number"]
      })
      .then(economic_entities => {
        console.log(economic_entities);
        this.setState({
          economic_entities: economic_entities,
          progress: 80
        }, () => {

          let enrichedPolygons = Object.assign({}, this.state.data);
          enrichedPolygons = enrichedPolygons['features']
            .map(pol => {
              let id = pol['properties']['ISO'];
              let polNewData = Object.assign({}, this.state.economic_entities.cubiql.dataset_economic_entitites.observations.page);

              polNewData = polNewData.observation.filter(obs => {
                let filter = this.state.filters.economic_entities.employee.includes(obs.employee_number);
                return (
                  (obs.iso == id.replace('-', '_')) && filter);
              });
              let aggregation = 0;
              polNewData.forEach(element => {
                aggregation = aggregation + parseInt(element.economic_entities_in_operation_at_the_beginning_of_the_year_units);
              });

              pol['properties']['economic_entities_in_operation_at_the_beginning_of_the_year_units'] = aggregation;
              return pol;
            });
          // data has the geojson file for lithuiania. Depending on the seetings we need to update the geojson file to display the variables we want
          let auxData = {
            "type": "FeatureCollection",
            features: enrichedPolygons
          }
          //this.setState({data:auxData});
          updatePercentiles(auxData, f => f.properties.economic_entities_in_operation_at_the_beginning_of_the_year_units);
          const mapStyle = defaultMapStyle
            // Add geojson source to map
            .setIn(['sources', 'residents'], fromJS({ type: 'geojson', data: auxData }))
            // Add point layer to map
            .set('layers', defaultMapStyle.get('layers').push(dataLayer));

          this.setState({ mapStyle, progress: 100 }, console.log(this.state));

        });
      })


  }

  _processForeign = () => {
    this.setState({
      progress: 50
    });
    cubiql.getObservationsFilteredByDimension(
      {
        "cube": "dataset_foreign_investment",
        "dimensions": {
          "measure_type": "FOREIGN_DIRECT_INVESTMENT_PER_CAPITA_AT_THE_END_OF_THE_YEAR_EUR"
        },
        "components": ["iso", "foreign_direct_investment_per_capita_at_the_end_of_the_year_eur", "time_period"]
      })
      .then(foreign_investment => {
        this.setState({
          foreign_investment: foreign_investment,
          progress: 80
        }, () => {

          let enrichedPolygons = Object.assign({}, this.state.data);
          enrichedPolygons = enrichedPolygons['features']
            .map(pol => {
              let id = pol['properties']['ISO'];
              let polNewData = Object.assign({}, this.state.foreign_investment.cubiql.dataset_foreign_investment.observations.page);
              let filter = this.state.filters.foreign_investment.year;
              polNewData = polNewData.observation.filter(obs => {
                return (
                  (obs.iso == id.replace('-', '_')) && filter.toString() === obs.time_period.substring(2));
              });

              pol['properties']['foreign_direct_investment_per_capita_at_the_end_of_the_year_eur'] = polNewData[0].foreign_direct_investment_per_capita_at_the_end_of_the_year_eur;
              return pol;
            });
          // data has the geojson file for lithuiania. Depending on the seetings we need to update the geojson file to display the variables we want
          let auxData = {
            "type": "FeatureCollection",
            features: enrichedPolygons
          }
          //this.setState({data:auxData});
          updatePercentiles(auxData, f => f.properties.foreign_direct_investment_per_capita_at_the_end_of_the_year_eur);
          const mapStyle = defaultMapStyle
            // Add geojson source to map
            .setIn(['sources', 'residents'], fromJS({ type: 'geojson', data: auxData }))
            // Add point layer to map
            .set('layers', defaultMapStyle.get('layers').push(dataLayer));

          this.setState({ mapStyle, progress: 100 }, console.log(this.state));

        });
      })



  }

  _processEarnings = () => {
    let enrichedPolygons = Object.assign({}, this.state.data);
    enrichedPolygons = enrichedPolygons['features']
      .map(pol => {
        let id = pol['properties']['ISO'];
        let polNewData = Object.assign({}, this.state.average_earnings.cubiql.dataset_average_earnings.observations.page);
        polNewData = polNewData.observation.filter(obs => {
          return (
            (obs.iso == id.replace('-', '_')));
        });

        pol['properties']['average_earnings_monthly_eur'] = polNewData[0].average_earnings_monthly_eur;
        return pol;
      });
    // data has the geojson file for lithuiania. Depending on the seetings we need to update the geojson file to display the variables we want
    let auxData = {
      "type": "FeatureCollection",
      features: enrichedPolygons
    }
    //this.setState({data:auxData});
    updatePercentiles(auxData, f => f.properties.average_earnings_monthly_eur);
    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'residents'], fromJS({ type: 'geojson', data: auxData }))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({ mapStyle }, console.log(this.state));

  }

  _processResidents = () => {
    //this.setState({ mapStyle: "mapbox://styles/mapbox/basic-v9" });
    let enrichedPolygons = Object.assign({}, this.state.data);
    enrichedPolygons = enrichedPolygons['features']
      .map(pol => {
        let id = pol['properties']['ISO'];
        let polNewData = Object.assign({}, this.state.residents.cubiql.dataset_resident_population.observations.page);
        polNewData = polNewData.observation.filter(obs => {
          //filter by ISO
          let filters = Object.assign({}, this.state.filters);
          let ageFilters = filters.residents.age.includes(obs.age);
          let genderFilters = filters.residents.gender.includes(obs.sex);
          return (
            (obs.iso == id.replace('-', '_')) && ageFilters && genderFilters);
        });
        let aggregation = 0;
        let female = 0;
        let male = 0;
        polNewData.forEach(element => {
          if (element.sex === 'FEMALES') {
            female += parseInt(element.resident_population_at_the_beginning_of_the_year_persons);
          }
          else {
            male += parseInt(element.resident_population_at_the_beginning_of_the_year_persons);
          }
          aggregation = aggregation + parseInt(element.resident_population_at_the_beginning_of_the_year_persons);
        });
        console.log(polNewData);
        pol['properties']['resident_population_at_the_beginning_of_the_year_persons'] = aggregation;
        pol['properties']['female'] = female;
        pol['properties']['male'] = male;
        return pol;
      });
    // data has the geojson file for lithuiania. Depending on the seetings we need to update the geojson file to display the variables we want
    let auxData = {
      "type": "FeatureCollection",
      features: enrichedPolygons
    }
    //this.setState({data:auxData});
    updatePercentiles(auxData, f => f.properties.resident_population_at_the_beginning_of_the_year_persons);
    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'residents'], fromJS({ type: 'geojson', data: auxData }))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({ mapStyle }, console.log(this.state));
    console.log(mapStyle);

    console.log("+ processed");
  }

  _processFood = () => {

    // this.setState({ mapStyle: "mapbox://styles/mapbox/basic-v9" });
    let economic_activities_points_filtered = this.state.fis.cubiql.dataset_fis.observations.page.observation
      .filter(place => {
        let economic_act_aux = (place.economic_activity || 'None');
        return this.state.filters.food_and_vet.economic.includes(economic_act_aux);

      })


    if (this.state.filters.food_and_vet.heatmap) { //if the user selects heatmap 

      console.log("user selected heatmap");

      let points = economic_activities_points_filtered

        .map((place, index) => {
          let info = {
            latitude: parseFloat(place.lat.substring(2).replace('_', '.')),
            longitude: parseFloat(place.long.substring(2).replace('_', '.'))
          }
          return {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "properties": { "id": "hgfdsh" + index },
              "coordinates": [info.longitude, info.latitude, 100]
            }
          }
        });

      let auxData = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": points
      }

      const mapStyle = defaultMapStyle
        .setIn(['sources', 'economicheatmap'], fromJS({ type: 'geojson', data: auxData }))
        // Add point layer to map
        .set('layers', defaultMapStyle.get('layers').push(heatMapLayer));

      this.setState({ mapStyle, markersReady: null }, console.log(this.state));
    }

    else {
      console.log("User unselected heatmap");
      this.setState({ mapStyle: "mapbox://styles/mapbox/basic-v9" });
      let points = [];
      // We need to create the geojson containing the lat-long pairs
      let places = economic_activities_points_filtered.map((place, index) => {
        console.log(place);
        let economic_act_aux = place.economic_activity || 'None';
        let info = {
          latitude: parseFloat(place.lat.substring(2).replace('_', '.')),
          longitude: parseFloat(place.long.substring(2).replace('_', '.')),
          economic_activity: economic_act_aux.replace(/_/g, ' '),
          date: place.paz_data.substring(2).replace(/_/g, '/')
        }

        points.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [info.latitude, info.longitude, 100]
          }
        });
        return (
          <Marker
            key={`marker-${index}`}
            longitude={info.longitude}
            latitude={info.latitude} >
            <PlacePin ec={place.economic_activity} size={20} onClick={() => {
              this.setState({ popupInfo: info }, () => console.log(this.state.popupInfo));

            }
            } />
          </Marker>
        );
      });
      this.setState({
        markersReady: places
      });
    }




    // console.log(places);


  }

  _onViewportChange = viewport => this.setState({ viewport });

  _onHover = event => {
    const { features, srcEvent: { offsetX, offsetY } } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  _renderTooltip() {

    const { hoveredFeature, year, x, y } = this.state;
    if (!hoveredFeature)
      return null;

    let hoverComponent = null;
    
    switch (this.state.datasetSelected) {
      case 'residents':
        hoverComponent = (
          <div>
            <div>Municipality: {hoveredFeature.properties.longName}</div>
            <div>Resident Population: {hoveredFeature.properties.resident_population_at_the_beginning_of_the_year_persons}</div>
            </div>);
        break;
      case 'food_and_vet':
        break;
      case 'average_earnings':
        hoverComponent = (
          <div><div>Municipality: {hoveredFeature.properties.longName}</div>
            <div>Average Earnings year 2015: €{hoveredFeature.properties.average_earnings_monthly_eur}</div></div>);
        break;
      case 'foreign_investment':
        hoverComponent = (
          <div><div>Municipality: {hoveredFeature.properties.longName}</div>
            <div>Foreign direct investment: €{hoveredFeature.properties.value}</div></div>);
        break;
      case 'investment_tangible':
        hoverComponent = (
          <div><div>Municipality: {hoveredFeature.properties.longName}</div>
            <div>Investment in tangible fixed assets: €{hoveredFeature.properties.value}</div></div>);
        break;
      case 'economic_entities':
        hoverComponent = (
          <div><div>Municipality: {hoveredFeature.properties.longName}</div>
            <div>Economis entitites in operation: {hoveredFeature.properties.value}</div></div>);
        break;


      default:
      // code block
    }

    return (
      <div className="my-tooltip" style={{ left: x, top: y }}>
        {hoverComponent}
        <ExtraChart hoveredFeature={hoveredFeature} datasetSelected = {this.state.datasetSelected} settings={this.state}/>
      </div>
    );
  }

  _renderPopup() {
    const { popupInfo } = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        closeOnClick={false}
        onClose={() => this.setState({ popupInfo: null })} >
        <PlaceInfo info={popupInfo} />
      </Popup>
    );
  }

  render() {

    const { viewport, mapStyle, markersReady } = this.state;

    let progressBar = this.state.progress === 100
      ? null
      : <div style={{
        position: 'relative'
      }}>
        <ProgressBar bsStyle="info" now={this.state.progress} />
      </div>

    return (
      <div style={{ height: '100%' }}>
        {progressBar}
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle={mapStyle}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this._onHover} >

          {this._renderTooltip()}
          {this.state.markersReady}
          {this._renderPopup()}
          <Messages ref={(el) => this.messages = el}></Messages>

        </MapGL>

        <ControlPanel containerComponent={this.props.containerComponent}
          settings={this.state} updateState={this._updateState} />
        
        <Footer />
      </div>


    );
  }

}