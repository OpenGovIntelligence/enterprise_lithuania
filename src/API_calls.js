import {CubiQLconnector} from 'cubiql-connector';


const api_url = "http://vmogi03.deri.ie:9000/graphql?query=";
const obs_limit = 20000;

export default new CubiQLconnector(api_url, obs_limit); 

