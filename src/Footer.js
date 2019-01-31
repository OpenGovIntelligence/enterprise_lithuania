import { Nav, Navbar, Footer, Panel } from 'react-bootstrap';
import React, { PureComponent } from 'react';

export default class footer extends PureComponent {
    render() {
        const DefaultContainer = ({ children }) => <div className="my-footer">{children}</div>;
        return (
            <DefaultContainer>
                <Panel>
                    <Panel.Body>Lithuania Enterpise - OpenGovIntelligence</Panel.Body>
                    <Panel.Footer>Fostering Innovation and Creativity in Europe through Public Administration Modernisation towards Supplying and Exploiting Linked Open Statistical Data</Panel.Footer>
                </Panel>
            </DefaultContainer>
        );
    }

}