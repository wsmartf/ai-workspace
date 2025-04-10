// import { useEffect, useState } from 'react';
// import { useAppContext } from '../context/AppContext';


// interface ContextMenuProps {
//     x: number;
//     y: number;
//     threadId: string;
//     messageIndex: number;
//     handleMenuClick: () => void;
//   }

// export function useContextMenu() {
//     const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);

//     const { createBranchThread } = useAppContext();

//     useEffect(() => {
//         const close = () => setContextMenu(null);
//         window.addEventListener("click", close);
//         return () => window.removeEventListener("click", close);
//     }, []);
    

//     return {
//         contextMenu,
//         setContextMenu,
//         onContextMenu,
//     };
// }