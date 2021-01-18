import React, {useEffect} from 'react';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';

const GameOver = props => {

  useEffect(() => {
    firebase.auth().signInAnonymously()
    .then(() => {
      console.warn('user signed in');
    })
    .catch(error => {
      console.log(error);
    });
  },[]);
  
  const checkIfSignedIn = () => {
    return !!firebase.auth().currentUser;
  }

  const submitScore = ev => {
    if(checkIfSignedIn()) {
      const input = document.querySelector('input');
      if(input.value !== ''){
        firebase.firestore().collection(
          firebase.auth().currentUser.uid)
          .doc('score').set({
            name: input.value,
            score: props.score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            console.warn('data written');
            window.location.reload();
          })
          .catch(error => {
            console.error(error);
          })
      }
    }
  }

  return (
    <div id="game-over-page">
      <p>All people found</p>
      <p>score {props.score}s</p>
      <p>Enter name and submit score</p>
      <input type="text"/>
      <button onClick={submitScore}>
        Submit
      </button>
    </div>
  );
}

export default GameOver;