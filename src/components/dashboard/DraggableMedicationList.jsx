import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Check, X, Clock, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// SortableMedicationItem component for each draggable medication
const SortableMedicationItem = ({ 
  medication, 
  markMedicationAsTaken, 
  markMedicationAsMissed 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: medication.id });


  const getStatusStyles = (medication) => {
    if (medication.taken) {
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-100 dark:border-green-800/30',
        text: 'text-green-600 dark:text-green-400',
        buttonBg: 'bg-green-500',
        icon: Check
      };
    } else if (medication.missed) {
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-100 dark:border-red-800/30',
        text: 'text-red-600 dark:text-red-400',
        buttonBg: 'bg-red-500',
        icon: X
      };
    } else {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-100 dark:border-blue-800/30',
        text: 'text-blue-600 dark:text-blue-400',
        buttonBg: 'bg-blue-500',
        icon: Clock
      };
    }
  };

  const styles = getStatusStyles(medication);
  const Icon = styles.icon;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all mb-3",
        styles.bg, styles.border
      )}
    >
      <div className="flex items-center">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", styles.buttonBg, "text-white")}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{medication.schedule}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", styles.text)}>{medication.time || 'Anytime'}</span>
            <div className="flex space-x-1">
              {!medication.taken && !medication.missed && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 rounded-lg"
                    onClick={() => markMedicationAsMissed(medication.id)}
                  >
                    Skip
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 rounded-lg"
                    onClick={() => markMedicationAsTaken(medication.id)}
                  >
                    Take
                  </Button>
                </>
              )}
              {medication.taken && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 rounded-lg"
                  onClick={() => markMedicationAsMissed(medication.id)}
                >
                  Mark Missed
                </Button>
              )}
              {medication.missed && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 rounded-lg"
                  onClick={() => markMedicationAsTaken(medication.id)}
                >
                  Take Late
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicationItemPreview = ({ medication }) => {
  const getStatusStyles = (medication) => {
    if (medication.taken) {
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-100 dark:border-green-800/30',
        text: 'text-green-600 dark:text-green-400',
        buttonBg: 'bg-green-500',
        icon: Check
      };
    } else if (medication.missed) {
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-100 dark:border-red-800/30',
        text: 'text-red-600 dark:text-red-400',
        buttonBg: 'bg-red-500',
        icon: X
      };
    } else {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-100 dark:border-blue-800/30',
        text: 'text-blue-600 dark:text-blue-400',
        buttonBg: 'bg-blue-500',
        icon: Clock
      };
    }
  };

  const styles = getStatusStyles(medication);
  const Icon = styles.icon;

  return (
    <div 
      className={cn(
        "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all max-w-xl",
        styles.bg, styles.border, 
        "shadow-lg opacity-90"
      )}
    >
      <div className="flex items-center">
        <div className="mr-3 text-gray-400">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", styles.buttonBg, "text-white")}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{medication.schedule}</p>
      </div>
    </div>
  );
};

const DraggableMedicationList = ({ 
  medications,
  onReorder,
  markMedicationAsTaken,
  markMedicationAsMissed
}) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = medications.findIndex((item) => item.id === active.id);
      const newIndex = medications.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(medications, oldIndex, newIndex);
      onReorder(newOrder);
    }
    
    setActiveId(null);
  };

  // Find the active medication
  const activeMedication = medications.find(med => med.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag to reorder your medications based on your priorities
          </p>
        </div>
        
        <SortableContext
          items={medications.map(med => med.id)}
          strategy={verticalListSortingStrategy}
        >
          {medications.map((medication) => (
            <SortableMedicationItem
              key={medication.id}
              medication={medication}
              markMedicationAsTaken={markMedicationAsTaken}
              markMedicationAsMissed={markMedicationAsMissed}
            />
          ))}
        </SortableContext>
      </div>
      
      <DragOverlay>
        {activeId ? (
          <MedicationItemPreview medication={activeMedication} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DraggableMedicationList;