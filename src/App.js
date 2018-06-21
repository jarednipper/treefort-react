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

    // TODO Right now this only handles 1 performer (most cases) - figure out what to do with multiple - event id 2018-9137674-Treefort
    // TODO handle no performers - event id 2018-0-Treefort

    const forts = this.props.event.forts.map((f) => {
      return <li>{f}</li>
    });

    return (
      <div>
        <ul>
          <li>{this.props.event.name}</li>
          <li>{this.props.event.start_time} - {this.props.event.end_time}</li>
          <li>{this.props.event.venue.name}</li>
          <li>{this.props.event.venue.street}</li>
          <li>{this.props.event.forts[0].name}</li>
          <li>{this.props.event.suggested_age}</li>
          {/* <li><b>Performers:</b></li>
          {this.props.performers.map((p) => {
            return <li key={p.id}>{p.name}</li>
          })} */}
          <li>
            <ul>{forts}</ul>
          </li>
        </ul>

        <img src={this.props.performers[0].image_url_med} alt='Performer' />

        <div>
          {this.props.performers[0].song
            ? <audio controls>
              <source src={this.props.performers[0].song.stream_url} type="audio/mp3" />
              <p><a href={this.props.performers[0].song.stream_url}>Listen</a></p>
            </audio>
            : null}
        </div>

        <div>
          {this.props.performers[0].video_url
            ? <p><a href={this.props.performers[0].video_url} target='_new'>Watch Video</a></p>
            : null
          }
        </div>

        <p>{this.props.performers[0].bio}</p>
        <p>TODO Genres</p>

      </div>
    )
  }

}

class FilterableEventTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventInputText: window.localStorage.getItem('eventInputText') || '',
      genreInputValue: window.localStorage.getItem('genreInputValue') || '',
      venueInputValue: window.localStorage.getItem('venueInputValue') || '',
    };

    this.handleEventInputChange = this.handleEventInputChange.bind(this);
    this.handleGenreInputChange = this.handleGenreInputChange.bind(this);
    this.handleVenueInputChange = this.handleVenueInputChange.bind(this);
  }

  handleEventInputChange(input) {
    this.setState({ eventInputText: input });
    window.localStorage.setItem('eventInputText', input);
  }

  handleGenreInputChange(input) {
    this.setState({ genreInputValue: input });
    window.localStorage.setItem('genreInputValue', input);
  }

  handleVenueInputChange(input) {
    this.setState({ venueInputValue: input });
    window.localStorage.setItem('venueInputValue', input);
  }

  render() {

    const genres = [...new Set(
      this.props.performerData
        .filter(p => p.genres != null)
        .map(p => p.genres)
        .reduce((flat, toFlatten) => flat.concat(toFlatten), [])
    )].sort();

    // TODO filter out venues that don't have events (12th st)
    const venues = this.props.venueData.map(v => v.name).sort();

    return (
      <div className="section">
        <div className="container">
          <Search
            onEventInputChange={this.handleEventInputChange}
            eventInputText={this.state.eventInputText}

            genres={genres}
            onGenreInputChange={this.handleGenreInputChange}
            genreInputValue={this.state.genreInputValue}

            venues={venues}
            onVenueInputChange={this.handleVenueInputChange}
            venueInputValue={this.state.venueInputValue}
          />
          <EventTable
            events={this.props.eventData}
            performers={this.props.performerData}
            eventInputText={this.state.eventInputText}
            genreInputValue={this.state.genreInputValue}
            venueInputValue={this.state.venueInputValue}
          />
        </div>
      </div>
    )
  }
}

const Search = ({ onEventInputChange, eventInputText, genres, onGenreInputChange, genreInputValue, venues, onVenueInputChange, venueInputValue }) => (
  <div>
    <EventInput
      onEventInputChange={onEventInputChange}
      eventInputText={eventInputText}
    />
    <GenreInput
      genres={genres}
      onGenreInputChange={onGenreInputChange}
      genreInputValue={genreInputValue}
    />
    <VenueInput
      venues={venues}
      onVenueInputChange={onVenueInputChange}
      venueInputValue={venueInputValue}
    />
  </div>
);

class GenreInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleGenreInputChange = this.handleGenreInputChange.bind(this);
  }

  handleGenreInputChange(e) {
    this.props.onGenreInputChange(e.target.value);
  }

  render() {
    const options = this.props.genres.map(e =>
      <option value={e} key={e}>{e}</option>
    );

    return (
      <div className="select">
        <select onChange={this.handleGenreInputChange} value={this.props.genreInputValue}>
          <option value="">All Genres</option>
          {options}
        </select>
      </div>
    )
  }
}

class VenueInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleVenueInputChange = this.handleVenueInputChange.bind(this);
  }

  handleVenueInputChange(e) {
    this.props.onVenueInputChange(e.target.value);
  }

  render() {
    const options = this.props.venues.map(e =>
      <option value={e} key={e}>{e}</option>
    );

    return (
      <div className="select">
        <select onChange={this.handleVenueInputChange} value={this.props.venueInputValue}>
          <option value="">All Venues</option>
          {options}
        </select>
      </div>
    )
  }
}

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
      events = events.filter(event => event.name.toLowerCase().match(this.props.eventInputText.toLowerCase()))
    }

    if (this.props.genreInputValue.length > 0) {
      // filter performers by genre
      const performerIds = this.props.performers
        .filter(p => p.genres != null && p.genres.includes(this.props.genreInputValue))
        .map(p => p.id)

      // filter events by remaining performers
      events = events.filter((e) => { return e.performers.some((p) => { return performerIds.includes(p.id) }) });

    }

    // filter venues
    if (this.props.venueInputValue.length > 0) {
      events = events.filter(e => e.venue.name === this.props.venueInputValue);
    }

    // filter forts ?


    events = events.sort((a, b) => {
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
