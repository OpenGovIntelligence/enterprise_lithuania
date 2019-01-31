import React, {PureComponent} from 'react';

export default class CityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.date}, ${info.economic_activity}`;

    return (
      <div>
        <div>
          <b>{info.economic_activity} </b> <br/>
          License issued on: {info.date} | <a target="_new"
          href={`http://maps.google.com/maps?q=&layer=c&cbll=${info.latitude},${info.longitude}`}>
            Google Street View
          </a>
        </div>
      </div>
    );
  }
}
