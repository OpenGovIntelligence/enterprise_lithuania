import React, { PureComponent } from 'react';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;



export default class CityPin extends PureComponent {

  render() {
    const { size = 20, onClick, ec } = this.props;

    let pinStyle = {
      cursor: 'pointer',
      fill: '#d00',
      stroke: 'none'
    };

    switch (ec) {
      case 'RESTAURANTS_AND_MOBILE_FOOD_SERVICE_ACTIVITIES':
        pinStyle.fill = '#0000dd';
        break;
      case 'MANUFACTURE_OF_RUSKS_AND_BISCUITS_MANUFACTURE_OF_PRESERVED_PASTRY_GOODS_AND_CAKES':
        pinStyle.fill = '#4add00';
        break;
      case 'OTHER_FOOD_SERVICE_ACTIVITIES':
        pinStyle.fill = '#dddd00';
        break;
        case 'RETAIL_SALE_VIA_STALLS_AND_MARKETS_OF_FOOD_BEVERAGES_AND_TOBACCO_PRODUCTS':
        pinStyle.fill = '#6f00dd';
        break;  
        case 'RETAIL_SALE_OF_BREAD_CAKES_FLOUR_CONFECTIONERY_AND_SUGAR_CONFECTIONERY_IN_SPECIALISED_STORES':
        pinStyle.fill = '#00dd6f';
        break;  
        case 'PACKAGING_ACTIVITIES':
        pinStyle.fill = '#ffffb7';
        break; 
        case 'BEVERAGE_SERVING_ACTIVITIES':
        pinStyle.fill = '#dd004a';
        break;  
        case 'RETAIL_SALE_IN_NON_SPECIALISED_STORES_WITH_FOOD_BEVERAGES_OR_TOBACCO_PREDOMINATING':
        pinStyle.fill = '#370013';
        break;   

        
      default:
    }

    return (
      <svg
        height={size}
        viewBox="0 0 24 24"
        style={{ ...pinStyle, transform: `translate(${-size / 2}px,${-size}px)` }}
        onClick={onClick}
      >
        <path d={ICON} />
      </svg>
    );
  }
}
