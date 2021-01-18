

const calculateImagePos = (x, y, rect) => {
  const xPos = parseFloat((x - rect.left)/rect.width).toFixed(3);
  const yPos = parseFloat((y - rect.top)/rect.height).toFixed(3);

  return [+xPos, +yPos];
}

const checkIfInbound = (x, y, faceBoxes, personPrediction) => {
  if(personPrediction === 1) {
    if(x < (faceBoxes.person1[0] + 0.02) && (x > faceBoxes.person1[0] - 0.02)){
      if(y < (faceBoxes.person1[1] + 0.02) && (y > faceBoxes.person1[1] - 0.02)){
        return true;
      }
    }
    return false;
  }
  else if(personPrediction === 2){
    if(x < (faceBoxes.person2[0] + 0.02) && (x > faceBoxes.person2[0] - 0.02)){
      if(y < (faceBoxes.person2[1] + 0.02) && (y > faceBoxes.person2[1] - 0.02)){
        return true;
      }
    }
    return false;
  }
  else if(personPrediction === 3){
    if(x < (faceBoxes.person3[0] + 0.02) && (x > faceBoxes.person3[0] - 0.02)){
      if(y < (faceBoxes.person3[1] + 0.02) && (y > faceBoxes.person3[1] - 0.02)){
        return true;
      }
    }
    return false;
  }
}

export {calculateImagePos, checkIfInbound};