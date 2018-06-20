import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Treefort from './Treefort';
import registerServiceWorker from './registerServiceWorker';

import eventData from './data/events.json'
import performerData from './data/performers.json'
import venueData from './data/venues.json'

ReactDOM.render(
    <Treefort
        eventData={eventData.body}
        performerData={performerData.body}
        venueData={venueData.body}
    />,
    document.getElementById('root')
);
registerServiceWorker();