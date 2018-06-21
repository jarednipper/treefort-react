import React from 'react';

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
    this.events().forEach(event => {
      rows.push(<EventRow key={event.id} event={event} />);
    });

    return (
      <table className="table is-fullwidth is-hoverable">
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

const EventRow = (props) => (
  <tr>
    <td><a href={`event/${props.event.id}`}>{props.event.name}</a></td>
    <td>{props.event.start_time}</td>
    <td>{props.event.venue.name}</td>
  </tr>
);

export default EventTable;