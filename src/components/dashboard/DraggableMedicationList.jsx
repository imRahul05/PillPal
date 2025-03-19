
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { GripVertical } from 'lucide-react';



const DraggableMedicationList = ({
  medications,
  onReorder,
  renderItem,
  droppableId
}) => {
  const [positions, setPositions] = useState({});

  // Handle drag stop - reorder items
  const handleDragStop = (medicationId, index, finalPosition) => {
    // Update position record
    const updatedPositions = { ...positions, [medicationId]: finalPosition };
    setPositions(updatedPositions);
    
    // Calculate new order based on vertical positions
    const itemsWithPositions = medications.map((med, idx) => ({
      medication: med,
      originalIndex: idx,
      position: updatedPositions[med.id] ? updatedPositions[med.id].y : idx * 100
    }));
    
    // Sort by position (y coordinate)
    itemsWithPositions.sort((a, b) => a.position - b.position);
    
    // Extract the newly ordered medications
    const reorderedMeds = itemsWithPositions.map(item => item.medication);
    
    // Call the parent's reorder function
    if (JSON.stringify(reorderedMeds.map(m => m.id)) !== JSON.stringify(medications.map(m => m.id))) {
      onReorder(reorderedMeds);
    }
  };

  return (
    <div className="space-y-3 relative" id={droppableId}>
      {medications.map((medication, index) => (
        <Draggable
          key={medication.id}
          axis="y"
          handle=".drag-handle"
          position={positions[medication.id] || { x: 0, y: 0 }}
          onStop={(e, data) => handleDragStop(medication.id, index, { x: data.x, y: data.y })}
          bounds={{ top: -500, bottom: 500 }}
        >
          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-gray-400 drag-handle">
              <GripVertical size={18} />
            </div>
            <div className="pl-8">
              {renderItem(medication, index)}
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default DraggableMedicationList;