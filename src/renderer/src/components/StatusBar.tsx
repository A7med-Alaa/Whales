import React, { ComponentProps, useEffect, useState } from 'react'

//Status Prop ---> Warning, Success, Failed
export type StatusBarProps = ComponentProps<'div'> & {
    status: string,
    title: string,
    activateRef: React.RefObject<boolean>
}
export default function StatusBar({ status, title, activateRef }: StatusBarProps) {
    const [isActivate, setIsActivate] = useState(false)
    useEffect(() => {
        setIsActivate(activateRef.current!)
    }, [activateRef])
    return (
        <div style={{
            backgroundColor: status === 'success' ? '#a3c2c2' : status === 'failed' ? 'red' : 'yellow',
            height: isActivate ? 30 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'height 0.15s ease-in-out',
        }}>
            <div style={{ color: 'black', paddingTop: 2, paddingBottom: 2, fontWeight: 'bold', letterSpacing: 0.7 }}>{title}</div>
        </div>
    )
}
