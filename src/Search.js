import React from 'react';

const Search = (props) => (
  <div>
    <EventInput
      onEventInputChange={props.onEventInputChange}
      eventInputText={props.eventInputText}
    />
    <GenreInput
      genres={props.genres}
      onGenreInputChange={props.onGenreInputChange}
      genreInputValue={props.genreInputValue}
    />
    <VenueInput
      venues={props.venues}
      onVenueInputChange={props.onVenueInputChange}
      venueInputValue={props.venueInputValue}
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

export default Search;