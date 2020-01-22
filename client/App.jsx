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
      didSearch: false,
    };
    this.grabFilm = this.grabFilm.bind(this);
  }

  grabFilm(e){
    e.preventDefault();
    const filmTitle = document.querySelector('#filmTitle').value;
    const apiSearchTitle = filmTitle.toLowerCase().split(' ').join('+');
    fetch(`http://www.omdbapi.com/?t=${apiSearchTitle}&apikey=7a8ad3d8`)
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        this.setState({
          title: result.Title,
          director: result.Director,
          imdbRating: result.imdbRating,
          imgUrl: result.Poster,
          didSearch: true,
        });
        console.log(this.state);
      })
      .catch(error => console.log(error));

    document.querySelector('#filmTitle').value='';
  }

  render(){
    return(
      <div className="App">
        <Search grabFilm={this.grabFilm}/>
        <FilmSearchDisplay didSearch={this.state.didSearch} imgUrl={this.state.imgUrl} title={this.state.title} director={this.state.director} imdbRating={this.state.imdbRating} />
      </div>
    );
  }
}

const Search = (props) => {
  return (
    <form>
      <input type="text" id="filmTitle" placeholder="Search Films..."></input>
      <input type="submit" id="search" value="submit" onClick={props.grabFilm}></input>
    </form>
  )
}

const FilmSearchDisplay = (props) => {
  const didSearch = props.didSearch;
  if (didSearch === true) {
    return (
      <div className="filmSearchDisplay">
      <img src={props.imgUrl} alt={props.title}></img>
      <p>Title: {props.title}</p>
      <p>Director: {props.director}</p>
      <p>imdb Rating: {props.imdbRating}</p>
    </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}



export default hot(module)(App);