import React, { Component} from "react";
import {hot} from "react-hot-loader";

class App extends Component{
  constructor(props, context) {
    super(props);
    this.state = {
      title: '',
      director: '',
      imdbRating: '',
      imgUrl: '',
      plot: '',
      films: [],
      didSearch: false,
      fetchedFilms: false
    };
    this.grabFilm = this.grabFilm.bind(this);
    this.addFilm = this.addFilm.bind(this);
    this.getFilms = this.getFilms.bind(this);
  }

  grabFilm(e){
    e.preventDefault();
    const filmTitle = document.querySelector('#filmTitle').value;
    const apiSearchTitle = filmTitle.toLowerCase().split(' ').join('+');
    fetch(`http://www.omdbapi.com/?t=${apiSearchTitle}&apikey=7a8ad3d8`)
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        if(result.Response === 'True'){
        this.setState({
          title: result.Title,
          director: result.Director,
          imdbRating: result.imdbRating,
          imgUrl: result.Poster,
          plot: result.Plot,
          didSearch: true,
        });
        console.log(this.state);
      }
      })
      .catch(error => console.log(error));

    document.querySelector('#filmTitle').value='';
  }

  getFilms(e){
    e.preventDefault();
    fetch('/getFilms')
      .then(resp => resp.json())
      .then((films) => {
        console.log('films:', films);
        // if (!Array.isArray(films)) films = [];
        return this.setState({
          films: films,
          fetchedChars: true
        });
      })
      .catch(err => console.log('componentDidMount: get films: ERROR: ', err));
  }

  addFilm(e){
    e.preventDefault();
    const filmData = {
      title: this.state.title,
      director: this.state.director,
      imdbRating: this.state.imdbRating,
      imgUrl: this.state.imgUrl,
      plot: this.state.plot,
      watched: 'false'
    }
    fetch('/films', {
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: 'POST',
      body: JSON.stringify(filmData),
    })
      .then(res => res.json())
      .then(data => console.log('created watchlist record: ', data))
      .catch(err => console.log('addFilm fetch /films: ERROR: ', err))
  }

  // componentDidUpdate() {
  //   fetch('/getFilms')
  //     .then(resp => resp.json())
  //     .then((films) => {
  //       console.log('films:', films);
  //       // if (!Array.isArray(films)) films = [];
  //       return this.setState({
  //         films: films,
  //         fetchedChars: true
  //       });
  //     })
  //     .catch(err => console.log('componentDidMount: get films: ERROR: ', err));
  // }

  render(){
    const { didSearch, imgUrl, title, director, imdbRating, plot, films } = this.state;
    const favFilmList = [];
    for (let i = 0; i < films.length; i += 1) {
      favFilmList.push(<Fav films={films[i]} key={i} />)
    }
    return(
      <div className="App">
        <Search getFilms={this.getFilms} grabFilm={this.grabFilm}/>
        <FilmSearchDisplay  addFilm={this.addFilm} didSearch={didSearch} imgUrl={imgUrl} title={title} director={director} imdbRating={imdbRating} plot={plot} />
        {favFilmList}
      </div>
    );
  }
}

const Search = (props) => {
  console.log('search props', props)
  return (
    <form>
      <input type="text" id="filmTitle" placeholder="Search Films..."></input>
      <input type="submit" id="search" value="submit" onClick={props.grabFilm}></input>
      <input type="submit" id="getFavs" value="view watchlist" onClick={props.getFilms}></input>
    </form>
  )
}

const FilmSearchDisplay = (props) => {
  const didSearch = props.didSearch;
  if (didSearch === true) {
    return (
      <div className="filmSearchDisplay">
      <img src={props.imgUrl} alt={props.title}></img>
      <p><strong>Title:</strong> {props.title}</p>
      <p><strong>Director:</strong> {props.director}</p>
      <p><strong>imdb Rating:</strong> {props.imdbRating}</p>
      <p><strong>Plot:</strong> {props.plot}</p>
      <input type="submit" id="addToWatchlist" value="add to watchlist" onClick={props.addFilm} ></input>
    </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

const Fav = (props) => {
  return (
    <div className="favs">
    <img src = {props.films.imgurl} alt={props.films.title}></img>
    <p><strong>Title:</strong> {props.films.title}</p>
    <p><strong>Director:</strong> {props.films.director}</p>
    <p><strong>imdb Rating:</strong> {props.films.imdbrating}</p>
  </div>
  )
}



export default hot(module)(App);