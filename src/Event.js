import React from 'react';

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

export default Event;