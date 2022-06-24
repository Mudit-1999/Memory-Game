import './game.css';
import React from 'react';
import logo from './pokeball.png';
import { useEffect, useState, useRef } from "react";



function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}



function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  
  return array;
}

function Cell(props){

  const images = importAll(require.context('./image', true, /.png$/));
  let imageIndex=props.imageIndex;
  if(imageIndex>=6)
    imageIndex=11-imageIndex;
  let value=props.history?images[imageIndex+'.png']:logo;

  const myStyle={
    backgroundImage:`url(${value})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'

  };
  
  return(
    <div style={myStyle}  key={props.imageIndex} className='grid-item' onClick ={props.onClick} > 
    </div>
  );
}


class Game extends React.Component{
  constructor(props){
    super(props);
    this.state={
      content:shuffle(Array.from(Array(12).keys())),
      history:Array.from(Array(12).fill(1)),
      openCards:[],
      numOfMoves:0,
      score:0,
    };
    delay(800).then(() => {
      this.setState({
        history:Array.from(Array(12).fill(0)),
      })})
  }

  handleClick(index,imageId){
    if(this.state.history[index] || this.state.openCards.length===2) {
      return; 
    }
    let history=this.state.history.slice();
    let openCards=this.state.openCards.slice();
    history[index]=1;
    openCards.push({
      'index':index,
      'imageId':imageId,
    });
    if(openCards.length==2) {
      this.state.numOfMoves=this.state.numOfMoves+1;
      if(openCards[0].imageId+openCards[1].imageId===11) {
        this.state.score=this.state.score+1;
        openCards=[];
      }
      else {
          delay(500).then(() => {
          history[openCards[0].index]=0;
          history[openCards[1].index]=0;
          this.setState({
            history:history,
            openCards:[],
          })
        });
      }
    }       
    this.setState({
      history:history,
      openCards:openCards,
    })
    return ;
  }
  render(){
    console.log(this.state.score,this.state.numOfMoves)
    return (
      <div>
      <div className='main-body'>
        <p className='heading'> Memory Game</p>
        <div className="container">
          {
            this.state.content.map((imageIndex,index) => {
            return (
              <Cell 
                imageIndex={imageIndex} 
                history={this.state.history[index]}
                onClick={()=>this.handleClick(index,imageIndex)}
              />
            );
          })
        }
      </div>
      </div>
      <div  className='score-section'>
        <p className='score'>Score: {this.state.score}</p>
        <button className='restart-button' onClick={()=> {
          this.setState({

              content:shuffle(Array.from(Array(12).keys())),
              history:Array.from(Array(12).fill(1)),
              openCards:[],
              numOfMoves:0,
              score:0,
              });
              delay(800).then(() => {
                this.setState({
                  history:Array.from(Array(12).fill(0)),
                })})
           }}
           > Restart</button>
        <p className='moves'>Moves: {this.state.numOfMoves}</p>
      </div>
    </div>
    );
  }
}


export default Game;
