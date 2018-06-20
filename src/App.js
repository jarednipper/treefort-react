import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css'

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

class Event extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>{this.props.event.name}</li>
          <li>{this.props.event.start_time} - {this.props.event.end_time}</li>
          <li>{this.props.event.venue.name}</li>
          <li>{this.props.event.venue.street}</li>
          <li>{this.props.event.forts[0].name}</li>
          <li>{this.props.event.suggested_age}</li>
          <li><b>Performers:</b></li>
          {this.props.performers.map((p) => {
            return <li key={p.id}>{p.name}</li>
          })}


        </ul>
      </div>
    )
  }

}

class FilterableEventTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventInputText: window.localStorage.getItem('eventInputText') || '',
    };

    this.handleEventInputChange = this.handleEventInputChange.bind(this);
  }

  handleEventInputChange(input) {
    this.setState({ eventInputText: input });
    window.localStorage.setItem('eventInputText', input);
  }

  render() {
    return (
      <div className="section">
        <div className="container">
          <Search
            onEventInputChange={this.handleEventInputChange}
            eventInputText={this.state.eventInputText}
          />
          <EventTable
            events={this.props.eventData}
            eventInputText={this.state.eventInputText}
          />
        </div>
      </div>
    )
  }
}

const Search = ({ onEventInputChange, eventInputText }) => (
  <EventInput
    onEventInputChange={onEventInputChange}
    eventInputText={eventInputText}
  />
);

class EventInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleEventInputChange = this.handleEventInputChange.bind(this);
  }

  handleEventInputChange(e) {
    this.props.onEventInputChange(e.target.value)
  }

  render() {
    return (
      <div className="field">
        <label className="label">Event</label>
        <div className="control">
          <input
            type="text"
            placeholder="Search Events"
            value={this.props.eventInputText}
            onChange={this.handleEventInputChange}
            className="input"
          />
        </div>
      </div>
    )
  }
}

class EventTable extends React.Component {
  events() {
    var events = this.props.events;

    if (this.props.eventInputText.length > 0) {
      events = events.filter((event) => { return event.name.toLowerCase().match(this.props.eventInputText.toLowerCase()); })
    }

    events = events.filter((event) => {
      return event.forts.includes('Treefort') && event.performers.length > 0
    }).sort((a, b) => {
      return a.start_time < b.start_time ? -1 : 1;
    });

    return events;
  }

  render() {
    var rows = [];
    this.events().forEach((event) => {
      rows.push(<EventRow key={event.id} event={event} />);
    });

    return (
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

const EventRow = ({ event }) => (
  <tr>
    <td><a href={`event/${event.id}`}>{event.name}</a></td>
    <td>{event.start_time}</td>
    <td>{event.venue.name}</td>
  </tr >
);

export default App;
