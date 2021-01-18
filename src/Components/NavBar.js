import React from 'react';


const NavBar = props => {

  const returnJSXContent = () => {
    if(props.playing) {
      return ([
        <div id="face-image-container" key="key-1">
          <div>
            <img src={props.urls[1]} 
              alt="" 
              className="face-image" 
              data-player="1"
              onClick={props.selectPerson}
            />
            <p>Cowboy</p>
          </div>
          <div>
            <img src={props.urls[2]} 
              alt="" 
              className="face-image" 
              data-player="2"
              onClick={props.selectPerson}  
            />
            <p>Steve</p>
          </div>
          <div>
            <img src={props.urls[3]} 
              alt="" 
              className="face-image" 
              data-player="3"
              onClick={props.selectPerson}
            />
            <p>Hat man</p>
          </div>
        </div>,
        <h2 key="key-2">time : {(props.time > 0) ? props.time + 's': ''}</h2>
      ]);
    }
    else {
      return (
        <h2>Where's waldo?</h2>
      );
    }
  }
  return (
    <div id="nav-container">
      {returnJSXContent()}
    </div>
  );
}

export default NavBar;