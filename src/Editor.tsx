import './Editor.css';

export type Instruction = "tcw" | "tcc" | "mov";
export type Program = Instruction[];
type ProgramEdit = Insert | Move | Delete;
interface Insert {
    kind: "insert";
    position: number;
    instruction: Instruction;
}
interface Delete {
    kind: "delete";
    position: number;
}
interface Move {
    kind: "move";
    fromPosition: number;
    toPosition: number;
}

const step = (data: Program, edit: ProgramEdit): Program => {
    switch (edit.kind) {
        case "insert": {
            const { position, instruction } = edit;
            const newData = [...data];
            newData.splice(position, 0, instruction);
            return newData;
        }
        case "delete": {
            const { position } = edit;
            const newData = [...data];
            newData.splice(position, 1);
            return newData;
        }
        case "move": {
            const { fromPosition, toPosition } = edit;
            const instruction = data[fromPosition];
            const data1 = step(data, { kind: "delete", position: fromPosition });
            const data2 = step(data1, { kind: "insert", instruction, position: (toPosition <= fromPosition) ? toPosition : toPosition + 1 });
            return data2;
        }
        default:
            throw `Impossible ${JSON.stringify(edit)}`;
    }
};

export const textEditor = (content: Program, onChange: (program: Program) => void) => {
    return (
        <textarea value={content.join("\n")} onChange={(e) => {
            e.preventDefault();
            onChange(e.target.value.split("\n") as Instruction[]);
        }}>
        </textarea>
    );
};

const iconOfInstruction: Record<Instruction, string> = {
    "mov": "≫",
    "tcw": "↻",
    "tcc": "↺",
};
const labelOfInstruction: Record<Instruction, string> = {
    "mov": "Forward",
    "tcw": "Turn Right",
    "tcc": "Turn Left",
};

const elementOfInstruction = (i: Instruction, pos: number) => {
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("edit/kind", "move");
        e.dataTransfer.setData("edit/fromPosition", "" + pos);
        e.dataTransfer.dropEffect = "move";
    };
    return (
        <div className='editor-instruction' draggable="true" onDragStart={onDragStart}>{iconOfInstruction[i]} {labelOfInstruction[i]}</div>
    );
};

export const graphicalEditor = (content: Program, onChange: (program: Program) => void) => {
    const onEdit = (edit: ProgramEdit) => {
        return onChange(step(content, edit));
    };

    const elementOfPlaceholder = (i: number) => {
        return (
            <div className='editor-placeholder'
                onDrop={(e) => {
                    e.preventDefault();
                    const editKind = e.dataTransfer.getData("edit/kind") as ProgramEdit["kind"];
                    switch (editKind) {
                        case "insert": {
                            const instruction = e.dataTransfer.getData("edit/instruction") as Instruction;
                            const position = i
                            return onEdit({ kind: "insert", position, instruction });
                        }
                        case "move": {
                            const fromPosition = parseInt(e.dataTransfer.getData("edit/fromPosition"))
                            const toPosition = i
                            return onEdit({ kind: "move", fromPosition, toPosition });
                        }
                        default:
                            throw `Impossible!`;
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    const editKind = e.dataTransfer.getData("edit/kind") as ProgramEdit["kind"];
                    e.dataTransfer.dropEffect = dropEffectOfEditKind(editKind);
                }}
            ></div>
        );
    };
    const elementOfTrashbin = () => {
        return (
            <div onDrop={(e) => {
                    e.preventDefault();
                    const editKind = e.dataTransfer.getData("edit/kind") as ProgramEdit["kind"];
                    switch (editKind) {
                        case "insert": {
                            // Do nothing
                            return;
                        }
                        case "move": {
                            const position = parseInt(e.dataTransfer.getData("edit/fromPosition"))
                            return onEdit({ kind: "delete", position });
                        }
                        default:
                            throw `Impossible!`;
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    const editKind = e.dataTransfer.getData("edit/kind") as ProgramEdit["kind"];
                    e.dataTransfer.dropEffect = dropEffectOfEditKind(editKind);
                }}
            >␡</div>
        );
    };

    const onDragStart = (i: Instruction) => {
        return (e: React.DragEvent<HTMLDivElement>) => {
            e.dataTransfer.setData("edit/kind", "insert");
            e.dataTransfer.setData("edit/instruction", i);
            e.dataTransfer.dropEffect = "copy";
            e.dataTransfer.effectAllowed = "copyMove";
        };
    };
    return (
        <div>
            <div id="editor-program">
                {
                    content.map((c, i) => {
                        return (
                            <>
                                {elementOfPlaceholder(i)}
                                {elementOfInstruction(c, i)}
                            </>
                        );
                    })
                }
                {elementOfPlaceholder(content.length)}
            </div>
            <div id='editor-panel'>
                {elementOfTrashbin()}
                <div draggable="true" onDragStart={onDragStart("mov")}>{iconOfInstruction["mov"]}</div>
                <div draggable="true" onDragStart={onDragStart("tcw")}>{iconOfInstruction["tcw"]}</div>
                <div draggable="true" onDragStart={onDragStart("tcc")}>{iconOfInstruction["tcc"]}</div>
            </div>
        </div>
    );
};

function dropEffectOfEditKind(editKind: ProgramEdit["kind"]): "move" | "link" | "none" | "copy" {
    const mapping: Record<ProgramEdit["kind"], "move" | "link" | "none" | "copy"> = {
        "insert": "copy",
        "delete": "none",
        "move": "move",
    }
    return mapping[editKind]
}
