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
      fortInputValue: window.localStorage.getItem('fortInputValue') || '',
      onlySavedEventsInputValue: window.localStorage.getItem('onlySavedEventsInputValue') || '',
    };

    this.handleEventInputChange = this.handleEventInputChange.bind(this);
    this.handleGenreInputChange = this.handleGenreInputChange.bind(this);
    this.handleVenueInputChange = this.handleVenueInputChange.bind(this);
    this.handleFortInputChange = this.handleFortInputChange.bind(this);
    this.handleOnlySavedEventsChange = this.handleOnlySavedEventsChange.bind(this);
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

  handleFortInputChange = (input) => {
    this.setState({ fortInputValue: input });
    window.localStorage.setItem('fortInputValue', input);
  }

  handleOnlySavedEventsChange = (input) => {
    this.setState({ onlySavedEventsInputValue: input });
    window.localStorage.setItem('onlySavedEventsInputValue', input);
  }

  render() {

    const genres = [...new Set(
      this.props.performerData
        .filter(p => p.genres != null)
        .map(p => p.genres)
        .reduce((flat, toFlatten) => flat.concat(toFlatten), [])
    )].sort();

    const forts = [...new Set(
      this.props.eventData
        .filter(e => e.forts != null)
        .map(e => e.forts)
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

            forts={forts}
            onFortInputChange={this.handleFortInputChange}
            fortInputValue={this.state.fortInputValue}

            onOnlySavedEventsChange={this.handleOnlySavedEventsChange}
            onlySavedEventsInputValue={this.state.onlySavedEventsInputValue}
          />
          <EventTable
            events={this.props.eventData}
            performers={this.props.performerData}
            eventInputText={this.state.eventInputText}
            genreInputValue={this.state.genreInputValue}
            venueInputValue={this.state.venueInputValue}
            fortInputValue={this.state.fortInputValue}
            mySavedEvents={this.props.mySavedEvents}
            onAddSavedEvent={this.props.onAddSavedEvent}
            onRemoveSavedEvent={this.props.onRemoveSavedEvent}
            onlySavedEvents={this.state.onlySavedEventsInputValue}
          />
        </div>
      </div>
    )
  }
}

export default FilterableEventTable;