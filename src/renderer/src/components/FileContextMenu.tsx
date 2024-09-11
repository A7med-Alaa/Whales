import React from 'react'
import { FaTrash } from "react-icons/fa6";

interface FileContextMenuProps {
    position: { x: number, y: number }
    onDelete: () => void,
}
export default function FileContextMenu({ position, onDelete }: FileContextMenuProps) {
    return (
        <div
            style={{
                position: 'absolute',
                top: `${position.y}px`,
                left: `${position.x}px`,
                backgroundColor: 'white',
                // border: '1px solid #ccc',
                boxShadow: '0px 0px 5px rgba(0,0,0,0.05)',
                padding: '10px 15px',
                width: 100,
                borderRadius: '15px',
                zIndex: 1000,
            }}
        >
            <ul style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                margin: 0, padding: 0, listStyle: 'none'
            }}>
                <li onClick={onDelete} className='contextMenuItem danger'>
                    <FaTrash />
                    <div style={{ marginLeft: '10px', paddingTop: 5 }}>Delete</div>
                </li>
            </ul>
        </div>
    )
}
