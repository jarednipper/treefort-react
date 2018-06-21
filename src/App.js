import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css';

import Event from './Event.js';
import FilterableEventTable from './FilterableEventTable.js';

// temp cache
import eventData from './data/events.json'
import performerData from './data/performers.json'
import venueData from './data/venues.json'

class App extends React.Component {

  componentDidMount() {
    //this.fetchEvents()
  }
  fetchEvents() {
    //return fetch("https://api.tmf.zone/prod/v1/events")
    //  .then(response => response.json())
    //  .then((events) => {
    //    this.setState({ events: events.body })
    //  });
  }

  renderEvent(props) {
    const eventId = props.match.params.eventId;
    const event = eventData.body.find((e) => { return e.id === eventId });
    const performerIds = event.performers.map((p) => { return p.id });

    var performers = performerData.body.filter((p) => { return performerIds.includes(p.id) })

    return <Event
      {...props}
      event={event}
      performers={performers}
    />
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            path="/"
            exact={true}
            render={(props) =>
              <FilterableEventTable
                {...props}
                eventData={eventData.body}
                performerData={performerData.body}
                venueData={venueData.body}
              />
            }
          />
          <Route
            path="/event/:eventId"
            render={(props) => this.renderEvent(props)}
          />
          <Route component={NoRouteMatch} />
        </Switch>
      </div>
    );
  }
}

const NoRouteMatch = () => (
  <div>your url is bad and you should feel bad.</div>
)

export default App;
