import React from 'react';
import NavBar from './NavBar';

type PanelProps = {
    children: React.ReactNode;
    title: string;
};

const Panel = ({ children, title }: PanelProps) => {
    return (
        <div className="panel-top-margin panel-bottom-margin flex items-center justify-center">
            <div className="background-image"><div className="rotating-line"></div></div>
            <div className="bg-white/70 p-4 rounded-lg shadow-md the-panel">
                <div className="logo">radar music</div>
                <NavBar/>
                <h1 className="text-2xl font-semibold mb-1">{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default Panel;