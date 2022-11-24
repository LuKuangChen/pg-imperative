import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Viz } from './Viz';
import { exampleState1, step } from './core';
import { textEditor, program } from './Editor';



function App() {
  const [state, setState] = useState({
    originalGrid: exampleState1,
    currentGrid: JSON.parse(JSON.stringify(exampleState1)),
    programContent: ["tcw", "mov", "mov"] as program,
    programIndex: 0,
    running: null as null | NodeJS.Timer
  });
  return (
    <div className="App">
      {Viz(state.currentGrid)}
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
      {textEditor(state.programContent, (programContent) => setState({
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
      programIndex: 0
    });
  }
}

export default App;
