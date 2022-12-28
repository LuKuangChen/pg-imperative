import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Viz } from './Viz';
import { cell, exampleState1, state, step } from './core';
import { textEditor, Program, graphicalEditor } from './Editor';
import { PhysicsObject, Scene } from './Physics';


const defaultProgramContent: Program = ["mov", "tcw", "tcc", "mov"];

function $<X>(x: X, fs: ((x: X) => X)[]): X {
  for (const f of fs) {
    x = f(x);
  }
  return x;
}

// let counter = 0;
// function newObject(): PhysicsObject {
//   const id = "" + (counter++);
//   return {
//     id: id,
//     position: { x: 0, y: Math.round(Math.random() * 499) },
//     range: { x: 10, y: 10 },
//     content: <div style={{ width: "100%", height: "100%", backgroundColor: "brown" }}></div>
//   };
// }
// function updateObject(o: PhysicsObject): PhysicsObject {
//   return {
//     ...o,
//     position: {
//       ...o.position,
//       x: (o.position.x + 20) % 500
//     }
//   };
// }

// const addObject: (x: PhysicsObject[]) => PhysicsObject[] =
//   (state) => [newObject(), ...state];

// const initWorld = $(
//   [] as PhysicsObject[],
//   [
//     // (state) => state.map(updateObject),
//     addObject,
//     addObject
//   ]
// );
// function App() {
//   const [state, setState] = useState(initWorld);
//   return <Scene objects={state} />;
// }

function App() {
  const [state, setState] = useState({
    originalGrid: exampleState1,
    currentGrid: JSON.parse(JSON.stringify(exampleState1)) as state,
    programContent: defaultProgramContent,
    programIndex: 0,
    running: null as null | NodeJS.Timer
  });
  const hasWon = state.currentGrid.gridContent.every((cs) => {
    return cs.every((c) => {
      return (c.kind === "empty" || ! c.hasTrash)
    })
  })
  return (
    <div className="App">
      {Viz(state.currentGrid)}
      <div>
        {hasWon ? "You has won!" : ""}
      </div>
      <button onClick={(e) => {
        e.preventDefault();
        resetState();
        const timer = setInterval(() => {
          setState((state) => {
            if (0 <= state.programIndex && state.programIndex < state.programContent.length) {
              const newGrid = step(state.currentGrid, state.programContent[state.programIndex]);
              if (newGrid !== null) {
                return {
                  ...state,
                  currentGrid: newGrid,
                  programIndex: state.programIndex + 1,
                  running: timer
                };
              }
            }
            clearInterval(timer)
            return {
              ...state, running: null
            }
          });
        }, 600);
      }} disabled={state.running !== null}>
        {(state.running !== null) ? "Running" : "Run"}
      </button>
      <button onClick={(e) => {
        e.preventDefault();
        resetState();
      }}>
        Reset
      </button>
      {graphicalEditor(state.programContent, (programContent) => setState({
        ...state,
        programContent,
        programIndex: 0
      }))}
    </div>
  );

  function resetState() {
    setState({
      ...state,
      currentGrid: JSON.parse(JSON.stringify(state.originalGrid)),
      // programContent: defaultProgramContent,
      programIndex: 0
    });
  }
}

export default App;
