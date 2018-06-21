import React from 'react';

class EventTable extends React.Component {
  events = () => {
    var events = this.props.events;

    if (this.props.eventInputText.length) {
      events = events.filter(event => event.name.toLowerCase().match(this.props.eventInputText.toLowerCase()))
    }

    if (this.props.genreInputValue.length) {
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

    //sort by time, then name
    events = events.sort((a, b) => {
      if (a.start_time < b.start_time) return -1;
      if (a.start_time > b.start_time) return 1;

      return (a.name < b.name) ? -1 : 1;
    });

    // sort by sort_order_within_tier
    // doesn't mix well between forts. need to sort additionally by fort
    // events = events.sort((a, b) => {

    //   if (!a.performers || !b.performers || !a.performers[0] || !b.performers[0]) {
    //     return 0;
    //   }

    //   const aPerformer = this.props.performers.find(p => p.id === a.performers[0].id);
    //   const bPerformer = this.props.performers.find(p => p.id === b.performers[0].id);

    //   if (!aPerformer || !bPerformer) {
    //     return 0;
    //   }

    //   return aPerformer.sort_order_within_tier < bPerformer.sort_order_within_tier ? -1 : 1;
    // });

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