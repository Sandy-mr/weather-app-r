import React, { Component } from 'react';

import './App.css';

import request from 'superagent';

class App extends Component {
  constructor() {
    super();

    this.state = {
      cities: [],
      show: false,
      timezone: 'Timezone',
      summary: 'Add a new city.'
    };
  }

  showInput = () => {
    this.setState({
      show: true
    });
  }

  addCity = (e) => {
    // I. If ENTER was pressed
    const ENTER_KEY = 13;

    if (e.keyCode === ENTER_KEY) {
      // II. Save new city in `cities`.
      this.setState({
        cities: [
          // III. Get past data.
          ...this.state.cities,
          {
            id: this.state.cities.length + 1,
            name: e.target.value
          }
        ],
        show: false
      });

      // IV. Clean the input.
      e.target.value = '';
    }
  }

  getCoords = (ENDPOINT) => {
    return request.get(ENDPOINT);
  }

  fetchWeather = (response) => {
    const coords = response.body.results[0].geometry.location;

    const ENDPOINT = `https://api.darksky.net/forecast/8c6c8467512243aac21331fe2e8d328e/${ coords.lat }, ${ coords.lng }`;

    request
      .get(ENDPOINT)
      .then(response => {
        document.querySelector(".test").innerHTML ="";
        this.setState({
          timezone: response.body.timezone,
          summary: response.body.currently.summary,
          time: timeStamp(response.body.currently.time),
          humidity: response.body.currently.humidity,
          pressure: response.body.currently.pressure,
          temperature: response.body.currently.temperature,
          wind: response.body.currently.windSpeed,
        });
        var days = response.body.daily.data;
        var template = '';
        for (const prop in days) {
          var symbol = iconer(days[prop].icon)
          //console.log(days[prop]);
          var fecha = timeConverter(days[prop].time)
          document.querySelector(".test").innerHTML += '<tr><td><i class="wi '+symbol+'"></i></td><td class="date">'+fecha+'</td><td class="temp">'+days[prop].temperatureMin+'°</td><td class="humidity">'+days[prop].humidity+'</td><td class="press">'+days[prop].pressure+'</td><td class="wind">'+days[prop].windSpeed+'</td></tr>';
        }
      });
  }


  fetchLocation = (e) => {
    e.preventDefault();

    const COUNTRY = e.target.textContent;
    const ENDPOINT = `https://maps.googleapis.com/maps/api/geocode/json?address=${ COUNTRY }`;

    this
      .getCoords(ENDPOINT)
      .then(this.fetchWeather)
      .catch(error => {
        this.setState({
          timezone: 'Timezone',
          summary: 'Something went wrong. Try again.'
        });
      });
  }

  render() {
    return (
      <div className='app'>
        <header className='app__header'>
          <button onClick={ this.showInput } className='app__add'>
            <i className='fa fa-plus-circle' /> New city
          </button>
        </header>
        <div className='grid'>
          <aside className='app__aside'>
            <h1 className='app__title'>All countries</h1>
            { this.state.cities.map(city => {
              return <a
                       onClick={ this.fetchLocation }
                       key={ city.id }
                       href='#'
                       className='app__country'
                      >
                        { city.name }
                      </a>
            }) }
            { this.state.show && <input onKeyUp={ this.addCity } autoFocus type='text' placeholder='Location' className='app__input' /> }
          </aside>
          <section className='app__view'>
            <div>
              <h3>{ this.state.timezone }</h3>
              <p>{ this.state.summary }</p>
              <table >
              <thead>
                <tr>
                    <td>icon</td>
                    <td>Date</td>
                    <td>Temperature</td>
                    <td>Humidity</td>
                    <td>Pressure</td>
                    <td>Wind</td>
                </tr>
            </thead>
              <tbody className="test">
              </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
var timeStamp = time =>{
    var d = new Date();
    d.setTime(time)

    //var dt = new Date(time*1000);
    return d.toString();
}
var timeConverter = UNIX_timestamp =>{
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var dayName = days[a.getDay()];
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = dayName+'     '+date + ' ' + month + ' ' + year ;
  return time;
}

var iconer = icon => {
  console.log(icon)
  var simbol;
  switch (icon) {
    case 'clear-day':
        simbol = "wi-day-sunny";
        break;
    case "clear-night":
        simbol = "wi-night-clear";
        break;
    case "partly-cloudy-day":
        simbol = "wi-day-cloudy";
        break;
    case "partly-cloudy-night":
        simbol = "wi-night-alt-cloudy";
        break;
    case "cloudy":
        simbol = "wi-cloudy";
        break;
    case "rain":
        simbol = "wi-rain";
        break;
    case "sleet":
        simbol = "wi-sleet";
        break;
    case "snow":
        simbol = "wi-snow";
        break;
    case "wind":
        simbol = "wi-strong-wind";
        break;
    case "fog":
        simbol = "wi-day-fog";
      }
    return simbol;
}
export default App;
