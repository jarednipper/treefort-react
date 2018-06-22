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
    if (this.props.venueInputValue.length) {
      events = events.filter(e => e.venue.name === this.props.venueInputValue);
    }

    // filter forts
    if (this.props.fortInputValue.length) {
      events = events.filter(e => e.forts.includes(this.props.fortInputValue));
    }

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

    const hourNames = {
      0: 'Late',
      1: 'Late',
      2: 'Late',
      3: 'Late',
      4: 'Late',
      5: 'Morning',
      6: 'Morning',
      7: 'Morning',
      8: 'Morning',
      9: 'Morning',
      10: 'Morning',
      11: 'Morning',
      12: 'Afternoon',
      13: 'Afternoon',
      14: 'Afternoon',
      15: 'Afternoon',
      16: 'Afternoon',
      17: 'Afternoon',
      18: 'Evening',
      19: 'Evening',
      20: 'Evening',
      21: 'Evening',
      22: 'Evening',
      23: 'Late',
    };

    var currentHourName = '';
    var hourName = '';

    this.events().forEach(event => {

      hourName = hourNames[new Date(event.start_time).getHours()];
      if (hourName !== currentHourName) {
        rows.push(
          <TimeRow
            key={`${event.id}-time`}
            event={event}
            hourName={hourName}
          />
        );
        currentHourName = hourName;
      }

      rows.push(
        <EventRow
          key={event.id}
          event={event}
          mySavedEvent={this.props.mySavedEvents.includes(event.id)}
        />
      );
    });

    // TODO improve this
    if (rows.length < 1) {
      rows.push(<tr key="none"><td>No events. Try changing the filters.</td></tr>)
    }

    return (
      <table className="table is-fullwidth is-hoverable">
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

const TimeRow = (props) => (
  <tr style={{ backgroundColor: 'gold' }}>
    <td colSpan="4">
      {props.event.start_time} {props.hourName}
    </td>
  </tr>
)

const EventRow = (props) => (
  <tr>
    <td><a href={`event/${props.event.id}`}>{props.event.name}</a></td>
    <td>{props.event.start_time}</td>
    <td>{props.event.venue.name}</td>
    <td>{props.mySavedEvent ? 'saved' : 'not saved'}</td>
  </tr>
);

export default EventTable;