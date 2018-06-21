import React from 'react';
import Search from './Search.js';
import EventTable from './EventTable.js';

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

  handleEventInputChange = (input) => {
    this.setState({ eventInputText: input });
    window.localStorage.setItem('eventInputText', input);
  }

  handleGenreInputChange = (input) => {
    this.setState({ genreInputValue: input });
    window.localStorage.setItem('genreInputValue', input);
  }

  handleVenueInputChange = (input) => {
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

export default FilterableEventTable;