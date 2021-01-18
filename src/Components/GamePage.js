import React from 'react';

const GamePage = props => {
  const style = {
    backgroundImage: `url("${props.urls[0]}")`
  }
  return (
    <div id="game-container">
      <div id="game-image-container" 
        onClick={props.onImageClick}
        onMouseEnter={props.onMouseEnterDiv}
        onMouseLeave={props.onMouseLeaveDiv}
        style={style}
      >
      </div>
    </div>
  );
}

export default GamePage;