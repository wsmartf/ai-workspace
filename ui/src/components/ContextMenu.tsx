import React, { useEffect } from "react";

export interface MenuItem {
    label: string;
    onClick: () => void;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    // Close the context menu on any click outside
    useEffect(() => {
        const handleClick = () => onClose();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [onClose]);

    return (
        <ul
            className="absolute bg-white border shadow text-sm z-50"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}  // prevent immediate close on inside clicks
        >
            {items.map((item, idx) => (
                <li
                    key={idx}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${idx < items.length - 1 ? 'border-b border-gray-200' : ''}`}
                    onClick={item.onClick}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    );
};
