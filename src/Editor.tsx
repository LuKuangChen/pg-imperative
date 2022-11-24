export type instruction = "tcw" | "tcc" | "mov"
export type program = instruction[];

export const textEditor = ( content: program, onChange: (program: program) => void) => {
    return (
        <textarea value={content.join("\n")} onChange={(e) => {
            e.preventDefault();
            onChange(e.target.value.split("\n") as instruction[])
        }}>
        </textarea>
    )
}