import { cell, dir, getCell, locationEqual, state } from "./core";
import './Viz.css';

const range = (n: number) => {
    return Array.from({ length: n }, (_x, i) => i);
};

const Robot = (face: dir) => {
    return (
        <div className={`robot robot-facing-${face}`}>
        </div>
    )
}

const Cell = (cell: cell, robot?: JSX.Element) => {
    return (
        <div className={`grid-cell cell-${cell.kind}`}>
            {robot}
        </div>
    )
}

export const Viz = (prop: state) => {
    const { robotAt,
        robotFace,
        gridWidth,
        gridHeight } = prop;
    return (
        <div id="grid">
            {range(gridHeight).map((i) => {
                return (
                    <div key={i} className="grid-row">
                        {range(gridWidth).map((j) => {
                            const robot = locationEqual(robotAt, [i, j]) ? Robot(robotFace) : undefined;
                            return Cell(getCell(prop, i, j), robot);
                        })}
                    </div>
                );
            })}
        </div>
    );
};