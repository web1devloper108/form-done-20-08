// import React from 'react';
// import { useDrag } from 'react-dnd';

// const DraggableItem = ({ id, name }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: 'ITEM',
//     item: { id, name },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return (
//     <div ref={drag} className="draggable-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {name}
//     </div>
//   );
// };

// export default DraggableItem; 





































import React from 'react'

function DraggableItem() {
  return (
    <div>DraggableItem greggrgrsgsg</div>
  )
}

export default DraggableItem







// import React from 'react';
// import { useDrag } from 'react-dnd';

// const DraggableItem = ({ id, name }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: 'ITEM',
//     item: { id, name },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return (
//     <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {name}
//     </div>
//   );
// };

// export default DraggableItem;













/////////1/
// import React from 'react';
// import { useDrag } from 'react-dnd';

// const DraggableItem = ({ id, name }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'FORM_ELEMENT',
//     item: { id, name },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', border: '1px solid #ccc', marginBottom: '4px', cursor: 'move' }}>
//       {name}
//     </div>
//   );
// };

// export default DraggableItem;
