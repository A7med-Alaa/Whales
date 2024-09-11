import React from 'react'

interface CoverProps {
    url?: string
}
export default function Cover({ url }: CoverProps) {
    return (
        <div style={url ? { width: '100%', height: '35vh' } : { display: 'none' }}>
            <img src={url} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    )
}
