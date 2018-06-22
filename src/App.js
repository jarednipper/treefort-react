import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css';

import Event from './Event.js';
import FilterableEventTable from './FilterableEventTable.js';

// temp cache
import eventData from './data/events.json'
import performerData from './data/performers.json'
import venueData from './data/venues.json'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mySavedEvents: window.localStorage.getItem('mySavedEvents') ? JSON.parse(window.localStorage.getItem('mySavedEvents')) : [],
    };

    this.handleAddSavedEvent = this.handleAddSavedEvent.bind(this);
    this.handleRemoveSavedEvent = this.handleRemoveSavedEvent.bind(this);
  }

  handleAddSavedEvent = (input) => {
    var mySavedEvents = this.state.mySavedEvents
    mySavedEvents.push(input);
    this.setState({ mySavedEvents: mySavedEvents });
    window.localStorage.setItem('mySavedEvents', JSON.stringify(mySavedEvents));
  }

  handleRemoveSavedEvent = (input) => {
    const newState = this.state.mySavedEvents.filter(e => e !== input);
    this.setState({ mySavedEvents: newState });
    window.localStorage.setItem('mySavedEvents', JSON.stringify(newState));
  }

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
    const event = eventData.body.find(e => e.id === eventId);
    const performerIds = event.performers.map(p => p.id);

    var performers = performerData.body.filter(p => performerIds.includes(p.id))

    return <Event
      {...props}
      event={event}
      performers={performers}
    />
  }

  render() {
    return (
      <Router>
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
                mySavedEvents={this.state.mySavedEvents}
              />
            }
          />
          <Route
            path="/event/:eventId"
            render={(props) => this.renderEvent(props)}
          />
          <Route component={NoRouteMatch} />
        </Switch>
      </Router>
    );
  }
}

const NoRouteMatch = () => (
  <div>your url is bad and you should feel bad.</div>
)

export default App;
