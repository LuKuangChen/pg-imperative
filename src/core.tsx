import { instruction } from "./Editor";

export type dir = "top" | "bottom" | "left" | "right";
export type location = [number, number];
export type cell = filledCell | emptyCell;
interface filledCell {
    kind: "filled";
}
interface emptyCell {
    kind: "empty";
}
export interface state {
    robotAt: location;
    robotFace: dir;
    gridWidth: number;
    gridHeight: number;
    gridContent: cell[][];
}

export const locationEqual = (l1: location, l2: location) => {
    return l1[0] === l2[0] && l1[1] === l2[1];
};
const tcw: Record<dir, dir> = {
    "top": "right",
    "right": "bottom",
    "bottom": "left",
    "left": "top",
}
const tcc: Record<dir, dir> = {
    "top": "left",
    "right": "top",
    "bottom": "right",
    "left": "bottom",
}
const movementOfDirection: Record<dir, [number, number]> = {
    "top": [-1, 0],
    "bottom": [1, 0],
    "left": [0, -1],
    "right": [0, 1],
};

const filledCell: filledCell = {
    kind: "filled"
};
const emptyCell: emptyCell = {
    kind: "empty"
};
export const exampleState1: state = {
    robotAt: [0, 0],
    robotFace: "top",
    gridWidth: 3,
    gridHeight: 3,
    gridContent: [
        [filledCell, filledCell, filledCell],
        [filledCell, filledCell, filledCell],
        [emptyCell, emptyCell, filledCell],
    ]
};
export const getCell = (state: state, i: number, j: number): cell => {
    if (!(0 <= i && i < state.gridHeight)) {
        throw `Invalid row index ${i}. A row index must be within ${0} and ${state.gridHeight}`;
    }
    if (!(0 <= j && j < state.gridWidth)) {
        throw `Invalid col index ${j}. A col index must be within ${0} and ${state.gridWidth}`;
    }
    return state.gridContent[i][j];
};

export const step = (state: state, instruction: instruction): state | null => {
    const [i, j] = state.robotAt;
    if (!(0 <= i && i < state.gridHeight)) {
        return null;
    }
    if (!(0 <= j && j < state.gridWidth)) {
        return null;
    }
    switch (instruction) {
        case "mov": {
            const [di, dj] = movementOfDirection[state.robotFace];
            return {
                ...state,
                robotAt: [i + di, j + dj]
            };
        }
        case "tcw": {
            return {
                ...state,
                robotFace: tcw[state.robotFace]
            }
        }
        case "tcc": {
            return {
                ...state,
                robotFace: tcc[state.robotFace]
            }
        }
    }
    throw `Impossible. The instruction is ${instruction}`
};