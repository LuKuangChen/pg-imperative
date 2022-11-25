import { Instruction } from "./Editor";

export type dir = "top" | "bottom" | "left" | "right";
export type location = [number, number];
export type cell = filledCell | emptyCell;
interface filledCell {
    kind: "filled";
    hasTrash: boolean;
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
};
const tcc: Record<dir, dir> = {
    "top": "left",
    "right": "top",
    "bottom": "right",
    "left": "bottom",
};
const movementOfDirection: Record<dir, [number, number]> = {
    "top": [-1, 0],
    "bottom": [1, 0],
    "left": [0, -1],
    "right": [0, 1],
};

const filledCell: filledCell = {
    kind: "filled",
    hasTrash: false,
};
const trashCell: filledCell = {
    kind: "filled",
    hasTrash: true,
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
        [filledCell, emptyCell, trashCell],
        [filledCell, filledCell, filledCell],
        [emptyCell, emptyCell, trashCell],
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

export const step = (state: state, instruction: Instruction): state | null => {
    const [i, j] = state.robotAt;
    if (!(0 <= i && i < state.gridHeight)) {
        return null;
    }
    if (!(0 <= j && j < state.gridWidth)) {
        return null;
    }
    switch (instruction) {
        case "mov": {
            if (state.gridContent[i][j].kind === "empty") {
                // Can't move if on empty.
                return null;
            }
            const [di, dj] = movementOfDirection[state.robotFace];
            const [i1, j1] = [i + di, j + dj];
            const [i2, j2] = [
                Math.max(0, Math.min(i1, state.gridHeight)),
                Math.max(0, Math.min(j1, state.gridWidth))
            ];
            const gridContent: cell[][] = JSON.parse(JSON.stringify(state.gridContent));
            const cell = gridContent[i2][j2];
            if (cell.kind == "filled") {
                cell.hasTrash = false;
            }
            return {
                ...state,
                gridContent,
                robotAt: [i2, j2]
            };
        }
        case "tcw": {
            return {
                ...state,
                robotFace: tcw[state.robotFace]
            };
        }
        case "tcc": {
            return {
                ...state,
                robotFace: tcc[state.robotFace]
            };
        }
    }
    throw `Impossible. The instruction is ${instruction}`;
};