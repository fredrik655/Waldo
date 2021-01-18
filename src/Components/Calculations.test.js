import {calculateImagePos, checkIfInbound} from './Calculations';

describe('image coordinates', () => {
  test('coords is between 0 and 1', () => {
    let [clientX, clientY] = [500, 500];
    const rect = {
      left: 0,
      top: 0,
      width: 1000,
      height: 1000,
    }

    expect(calculateImagePos(clientX, clientY, rect)[0]).toBeCloseTo(0.5);
    expect(calculateImagePos(clientX, clientY, rect)[1]).toBeCloseTo(0.5);


    [clientX, clientY] = [250, 300];
    expect(calculateImagePos(clientX, clientY, rect)[0]).toBeCloseTo(0.25);
    expect(calculateImagePos(clientX, clientY, rect)[1]).toBeCloseTo(0.3);
  });

  test('calculate if clicked position is inside face box', () => {
    const faceBoxes = {
      person1: [0.1, 0.2],
      person2: [0.5, 0.5],
      person3: [0.7, 0.4],
    }

    expect(checkIfInbound(0.5, 0.5, faceBoxes, 1)).toBe(false);
    expect(checkIfInbound(0.5, 0.5, faceBoxes, 2)).toBe(true);
    expect(checkIfInbound(0.119, 0.215, faceBoxes, 1)).toBe(true);
    expect(checkIfInbound(0.5, 0.5, faceBoxes, 3)).toBe(false);
    expect(checkIfInbound(0.702, 0.392, faceBoxes, 3)).toBe(true);
  })
})