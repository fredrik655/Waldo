import './App.css';
import Home from './Components/Home';
import NavBar from './Components/NavBar';
import GamePage from './Components/GamePage';
import React, {useState, useEffect} from 'react';
import {calculateImagePos, checkIfInbound} from './Components/Calculations';
import MouseObj from './Components/MouseObj';
import GameOver from './Components/GameOver';
import firebase from 'firebase/app';
import 'firebase/firebase-storage';
import 'firebase/firebase-firestore';



const App = () => {
  const [playing, setPlaying] = useState(false);
  const [currentChosenPerson, setCurrentChosenPerson] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [placedPositions, setPlacedPositions] = useState([
    [0, 0],
    [0, 0],
    [0, 0]
  ]);
  const [personsFound, setPersonsFound] = useState(
    [
      false,
      false,
      false
    ]
  );
  const [faceBoundBoxes, setFaceBoundBoxes] = useState(
    {
      person1: [0, 0],
      person2: [0, 0],
      person3: [0, 0],
    }
  )
  
  useEffect(() => {
    let timer = () => {};
    if(gameOver === false){
      timer = setTimeout(() => {
        setDisplayTime(displayTime + 1);
      },1000);
    }
    else {
      setDisplayTime(0);
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTime])
  
  useEffect(() => {
    document.addEventListener('mousemove', mouseFollow);
    let tempArr = [...imageUrls];

      const storage = firebase.storage();
      storage.ref('/waldo(1).png').getDownloadURL().then((url) => {
        tempArr.push(url);
      })
      .finally(() => {
        storage.ref('/waldoPerson1.png').getDownloadURL().then((url) => {
          tempArr.push(url);
        }).finally(() => {
          storage.ref('/waldoPerson2.png').getDownloadURL().then((url) => {
            tempArr.push(url);
          }).finally(() => {
            storage.ref('/waldoPerson3.png').getDownloadURL().then((url) => {
              tempArr.push(url);
              setImageUrls(tempArr);
              setImageLoading(false);
            });
          });
        });
      });

    const docRef = firebase.firestore().collection("imagePositions").doc("people");
    docRef.get().then(doc => {
      if(doc.exists) {
        const data = doc.data();
        const tempFaceArr = {...faceBoundBoxes};
        tempFaceArr.person1[0] = +data.person1[0];
        tempFaceArr.person1[1] = +data.person1[1];
        tempFaceArr.person2[0] = +data.person2[0];
        tempFaceArr.person2[1] = +data.person2[1];
        tempFaceArr.person3[0] = +data.person3[0];
        tempFaceArr.person3[1] = +data.person3[1];
        setFaceBoundBoxes(tempFaceArr);
      }
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const imageElements = [...document.getElementsByClassName('face-image')];
    imageElements.forEach((element, i) => {
      element.style.border = 'none';
      if(+element.getAttribute('data-player') === currentChosenPerson && !personsFound[i]) {
        element.style.border = '5px solid green';
      }
      if(personsFound[i] === true) {
        element.style.border = '2px dashed red';
        element.style.opacity = 0.5;
        element.style.pointerEvents = 'none';
      }
    });

    if(!personsFound.includes(false)){
      const body = document.querySelector('body');
      const mouseObj = document.querySelector('#mouse-obj');
      mouseObj.style.opacity = 0;
      body.style.cursor = 'default';
      setGameOver(true);
    }
  }, [currentChosenPerson, personsFound]);
  
  useEffect(() => {
    setDisplayTime(Math.round((new Date()).getTime()/1000) - startTime);
  },[startTime]);

  useEffect(() => {
    if(playing === true){
      setCurrentChosenPerson(1);
    }
  }, [playing])

  const selectPerson = ev => {
    setCurrentChosenPerson(+ev.target.getAttribute('data-player'));
  }

  const onImageClick = ev => {
    const rect = ev.target.getBoundingClientRect();
    const [xPos, yPos] = calculateImagePos(ev.clientX, ev.clientY, rect);
    const chosenPerson = currentChosenPerson;
    if(checkIfInbound(xPos, yPos, faceBoundBoxes, chosenPerson)){
      if(personsFound[chosenPerson -1] === false){
        const tempArr = [...placedPositions];
        const tempFound = [...personsFound];
        tempArr[chosenPerson -1] = [xPos, yPos];
        setPlacedPositions(tempArr);
        tempFound[chosenPerson -1] = true;
        setPersonsFound(tempFound);
      }
    }
  }

  const mapClick = ev => {
    setPlaying(true);
  }

  const onMouseEnterDiv = ev => {
    const body = document.querySelector('body');
    const mouseObj = document.querySelector('#mouse-obj');
    mouseObj.style.opacity = 1;
    body.style.cursor = 'none';
  }

  const onMouseLeaveDiv = ev => {
    const body = document.querySelector('body');
    const mouseObj = document.querySelector('#mouse-obj');
    mouseObj.style.opacity = 0;
    body.style.cursor = 'default';
  }

  const mouseFollow = ev => {
    const mouseObj = document.querySelector('#mouse-obj');
    const left = ev.pageX;
    const top = ev.pageY;
    mouseObj.style.left = left + 'px';
    mouseObj.style.top = top + 'px';
  }

  const returnJSXContent = () => {
    if(gameOver) {
      if(endTime === 0) {
      setEndTime(firebase.firestore.Timestamp.now().seconds);
      }
      return <GameOver 
        score={endTime - startTime}
      />;
    }
    else {  
      if(playing) {
        if(startTime === 0) {
          setStartTime(firebase.firestore.Timestamp.now().seconds);
        }
        return <GamePage 
          onImageClick={onImageClick} 
          onMouseEnterDiv={onMouseEnterDiv} 
          onMouseLeaveDiv={onMouseLeaveDiv}
          urls={imageUrls}
        />;
      }
      else {
        return <Home mapClick={mapClick} urls={imageUrls} loading={imageLoading}/>;
      }
    }
  }

  
  return (
    <div className="App">
      <MouseObj />
      <NavBar 
        playing={playing}
        selectPerson={selectPerson}
        urls={imageUrls}
        time={displayTime}
      />
      {returnJSXContent()}
    </div>
  );
}

export default App;
