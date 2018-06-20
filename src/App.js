import React from 'react';
import { Route } from 'react-router-dom';
import 'bulma/css/bulma.css'

// temp cache
import eventData from './data/events.json'
import performerData from './data/performers.json'
import venueData from './data/venues.json'

class App extends React.Component {
  render() {
    return (
      <div>
        <Route
          path="/"
          exact={true}
          render={(props) =>
            <Treefort
              {...props}
              eventData={eventData.body}
              performerData={performerData.body}
              venueData={venueData.body}
            />
          }
        />
        <Route
          path="/event/:performerId"
          render={(props) =>
            <Performer
              {...props}
              eventData={eventData.body}
              performerData={performerData.body}
              venueData={venueData.body}
            />
          }
        />
      </div>
    );
  }
}

class Performer extends React.Component {
  constructor(props) {
    super(props);

    var performerId = props.match.params.performerId;
    this.performer = props.performerData.find((performer) => { return performer.id === performerId });
  }
  render() {
    return (
      <div>
        {this.performer.name}
      </div>
    )
  }
}

class Treefort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artistInputText: window.localStorage.getItem('artistInputText') || '',
    };

    this.handleArtistInputChange = this.handleArtistInputChange.bind(this);
  }

  handleArtistInputChange(input) {
    this.setState({ artistInputText: input });
    window.localStorage.setItem('artistInputText', input);
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

  render() {
    return (
      <div className="section">
        <div className="container">
          <Search
            onArtistInputChange={this.handleArtistInputChange}
            artistInputText={this.state.artistInputText}
          />
          <EventTable
            events={this.props.eventData}
            artistInputText={this.state.artistInputText}
          />
        </div>
      </div>
    )
  }
}

class Search extends React.Component {
  render() {
    return (
      <ArtistInput
        onArtistInputChange={this.props.onArtistInputChange}
        artistInputText={this.props.artistInputText}
      />
    )
  }
}

class ArtistInput extends React.Component {

  constructor(props) {
    super(props);
    this.handleArtistInputChange = this.handleArtistInputChange.bind(this);
  }

  handleArtistInputChange(e) {
    this.props.onArtistInputChange(e.target.value)
  }

  render() {
    return (
      <div className="field">
        <label className="label">Artist</label>
        <div className="control">
          <input
            type="text"
            placeholder="Artist"
            value={this.props.artistInputText}
            onChange={this.handleArtistInputChange}
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

    if (this.props.artistInputText.length > 0) {
      events = events.filter((event) => {
        return event.performers.length > 0 &&
          event.performers[0].name.toLowerCase().includes(this.props.artistInputText.toLowerCase())
      });
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
            <th>Artist</th>
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

class EventRow extends React.Component {
  render() {
    var performers = this.props.event.performers.map((p) => { return p.name }).join(', ');
    return (
      <tr>
        <td>{performers}</td>
        <td>{this.props.event.start_time}</td>
        <td>{this.props.event.venue.name}</td>
      </tr>
    )
  }
}

export default App;
