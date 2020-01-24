import React, { PureComponent} from "react";
import {hot} from "react-hot-loader";

import './styles.css';

class App extends PureComponent{
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
    this.deleteFilm = this.deleteFilm.bind(this);
    this.getFilmsFunc = this.getFilmsFunc.bind(this);
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

  getFilmsFunc(){
    fetch('/api/getFilms')
      .then(resp => resp.json())
      .then((films) => {
        return this.setState({
          films: films,
          fetchedFilms: true
        });
      })
      .catch(err => console.log('componentDidMount: get films: ERROR: ', err));
  }

  componentDidMount(){
    return this.getFilmsFunc();
  }


  getFilms(e){
    return this.getFilmsFunc();
  }

  componentDidUpdate(prevState){
    if(this.state.films !== prevState.films){
      return this.getFilmsFunc();
    }
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
    fetch('/api/films', {
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: 'POST',
      body: JSON.stringify(filmData),
    })
      .then(res => res.json())
      .then(data => {
        console.log('created watchlist record: ', data)
        return this.setState({
          didSearch: false
        })
      })
      .catch(err => console.log('addFilm fetch /films: ERROR: ', err))
  }

  deleteFilm(e){
    e.preventDefault();
    const deleteTitle = e.target.title;
    console.log(JSON.stringify(deleteTitle));
    fetch(`/api/deleteFilm?title=${deleteTitle}`, {
      method: 'DELETE',
    })
      .then(res => res.text())
      .then(text => {
        console.log('deleted from watchlist: ', text);
      })
      .catch(err => console.log('deleteFilm fetch ERROR: ', err))
  }

  render(){
    const { didSearch, imgUrl, title, director, imdbRating, plot, films } = this.state;
    const favFilmList = [];
    for (let i = 0; i < films.length; i += 1) {
      favFilmList.push(<Fav films={films[i]} deleteFilm={this.deleteFilm} key={i} />)
    }
    return(
      <div className="App">
        <div className='searchBar'>
          <h1>What do you want to watch?</h1>
          <Search getFilms={this.getFilms} grabFilm={this.grabFilm}/>
          <h2>Watchlist</h2>
        </div>
        <div className="searchResult">
          <FilmSearchDisplay inOrderAdd={this.inOrderAdd} addFilm={this.addFilm} didSearch={didSearch} imgUrl={imgUrl} title={title} director={director} imdbRating={imdbRating} plot={plot} />
        </div>
        <div className='watchListDiv'>
          {favFilmList}
        </div>  
      </div>
    );
  }
}

const Search = (props) => {

  return (
    <form>
      <input type="text" id="filmTitle" placeholder="Search Films..."></input>
      <input type="submit" id="search" value="Enter" onClick={props.grabFilm}></input>
      {/* <input type="submit" id="getFavs" value="view watchlist" onClick={props.getFilms}></input> */}
    </form>
  )
}

const FilmSearchDisplay = (props) => {
  const didSearch = props.didSearch;
  if (didSearch === true) {
    return (
      <div className="filmSearchDisplay">
        <img src={props.imgUrl} alt={props.title} className="filmImage"></img>
      <div className="filmInfo">
        <div>
          <h3>{props.title}</h3>
          <p><strong>Director</strong> &mdash; {props.director}</p>
          <p><strong>imdb Rating</strong> &mdash; {props.imdbRating}</p>
          <p><strong>Plot</strong> &mdash; {props.plot}</p>
        </div>
        <input type="submit" className="btn" id="addToWatchlist" value="add to watchlist" onClick={props.addFilm} ></input>
      </div>
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
      <img src = {props.films.imgurl} alt={props.films.title} className="filmImg"></img>
        <div className="filmInfo">
          <div>
            <h3>{props.films.title}</h3>
            <p><strong>Director</strong> &mdash; {props.films.director}</p>
            <p><strong>imdb Rating</strong> &mdash; {props.films.imdbrating}</p>
            <p><strong>Plot</strong> &mdash; {props.films.plot}</p>
          </div>
          <input type="submit" className="btn" id="delete" title={props.films.title} value="remove from watchlist" onClick={props.deleteFilm} ></input>
        </div>
      </div>
  )
}



export default hot(module)(App);