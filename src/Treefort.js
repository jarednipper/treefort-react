import React from 'react';
import './App.css';
import 'bulma/css/bulma.css'

/**

 |-Treefort----------------------------|
 |                                     |
 |  |-Search----------------------|    |
 |  |                             |    |
 |  |   |-ArtistInput---------|   |    |
 |  |   |                     |   |    |
 |  |   |---------------------|   |    |
 |  |                             |    |
 |  |-----------------------------|    |
 |                                     |
 |  |-EventTable------------------|    |
 |  |                             |    |
 |  |   |-EventRow------------|   |    |
 |  |   |                     |   |    |
 |  |   |---------------------|   |    |
 |  |                             |    |
 |  |   |-EventRow------------|   |    |
 |  |   |                     |   |    |
 |  |   |---------------------|   |    |
 |  |                             |    |
 |  |-----------------------------|    |
 |                                     |
 |-------------------------------------|

*/


class Treefort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artistInputText: '',
    };

    this.handleArtistInputChange = this.handleArtistInputChange.bind(this);
  }

  handleArtistInputChange(input) {
    this.setState({ artistInputText: input });
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
      <div class="section">
        <div class="container">
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
      <div class="field">
        <label class="label">Artist</label>
        <div class="control">
          <input
            type="text"
            placeholder="Artist"
            value={this.props.artistInputText}
            onChange={this.handleArtistInputChange}
            class="input"
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
      rows.push(<EventRow event={event} />);
    });

    return (
      <table class="table is-fullwidth is-hoverable">
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

export default Treefort;
