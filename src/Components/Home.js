import React from 'react';


const Home = props => {
  const style = {
    backgroundImage: `url("${props.urls[0]}")`
  }

  const generateContent = () => {
    if(props.loading === true) {
      return <section>
        <h3>Maps loading</h3>
      </section>
    }
    else {
      return (<section>
      <div className="image-select-container" onClick={props.mapClick} style={style}></div>
      </section>);
    }
  }
  return (generateContent());
}

export default Home;