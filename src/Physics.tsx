import './Physics.css';

interface Vec2 {
    x: number;
    y: number;
}

export interface PhysicsObject {
    id: string;
    range: Vec2;
    position: Vec2;
    content: JSX.Element;
}

interface World {
    objects: PhysicsObject[];
}

export function Scene(prop: World) {
    const { objects } = prop;
    return (
        <div className="PhysicsScene">
            {objects.map(showObject)}
        </div>
    );
}

function showObject(o: PhysicsObject) {
    const { id, range, position, content } = o;
    return (
        <div key={id} style={{
            left: position.x,
            top: position.y,
            width: range.x,
            height: range.y,
        }}>
            {content}
        </div>
    );
}