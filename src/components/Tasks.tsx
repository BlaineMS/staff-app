'use client';

import { useState } from 'react';
import { staffMembers as sampleStaffMembers } from '@/data/sampleData';

export type TaskCategory = 'Opening' | 'Closing' | 'Cellar' | 'Kitchen' | 'Bar' | 'General' | 'Personal';

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  completed: boolean;
  assignedTo?: string; // undefined for general tasks, staff name for personal tasks
}

// Create staff list with 'All' first, then all staff members from sampleData
const staffList = ['All', ...sampleStaffMembers.map(member => member.name)];

// Define a color palette for staff members (at least 10 distinct colors)
const staffColors = [
  // Purple
  { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)', text: '#8b5cf6' },
  // Red/Crimson
  { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' },
  // Orange
  { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)', text: '#f97316' },
  // Green
  { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' },
  // Blue
  { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6' },
  // Pink
  { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)', text: '#ec4899' },
  // Amber
  { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b' },
  // Teal
  { bg: 'rgba(20, 184, 166, 0.15)', border: 'rgba(20, 184, 166, 0.4)', text: '#14b8a6' },
  // Indigo
  { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.4)', text: '#6366f1' },
  // Rose
  { bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.4)', text: '#f43f5e' },
  // Lime
  { bg: 'rgba(132, 204, 22, 0.15)', border: 'rgba(132, 204, 22, 0.4)', text: '#84cc16' },
  // Cyan
  { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)', text: '#06b6d4' },
];

// Create a mapping from staff name to color
const getStaffColor = (staffName: string) => {
  if (staffName === 'All') {
    return { bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)', text: '#ffffff' };
  }
  
  // Find the index of the staff member in the staffList (excluding 'All')
  const staffIndex = staffList.indexOf(staffName) - 1; // -1 because 'All' is at index 0
  
  // Use modulo to cycle through colors if we have more staff than colors
  const colorIndex = staffIndex % staffColors.length;
  return staffColors[colorIndex];
};

const generalTasks: Task[] = [
  { id: '1', name: 'Open up and disable alarm', category: 'Opening', completed: false },
  { id: '2', name: 'Check cellar temperature', category: 'Cellar', completed: false },
  { id: '3', name: 'Wipe down all tables', category: 'Bar', completed: false },
  { id: '4', name: 'Restock beer fridges', category: 'Bar', completed: false },
  { id: '5', name: 'Check toilet cleanliness', category: 'General', completed: false },
  { id: '6', name: 'Cash up float', category: 'Opening', completed: false },
  { id: '7', name: 'Check gas levels', category: 'Cellar', completed: false },
  { id: '8', name: 'Clean coffee machine', category: 'Kitchen', completed: false },
  { id: '9', name: 'Lock up and set alarm', category: 'Closing', completed: false },
  { id: '10', name: 'Empty bins', category: 'Closing', completed: false },
];

const personalTasks: Task[] = [
  { id: 'p1', name: 'Deep clean the cellar', category: 'Personal', completed: false, assignedTo: 'Tracy' },
  { id: 'p2', name: 'Fix the wobbly bar stool', category: 'Personal', completed: false, assignedTo: 'Tracy' },
  { id: 'p3', name: 'Update the specials board', category: 'Personal', completed: false, assignedTo: 'Sacha' },
  { id: 'p4', name: 'Call the drinks supplier', category: 'Personal', completed: false, assignedTo: 'Sacha' },
  { id: 'p5', name: 'Organize storage room', category: 'Personal', completed: false, assignedTo: 'Kylie' },
  { id: 'p6', name: 'Check first aid kit', category: 'Personal', completed: false, assignedTo: 'Ella' },
  { id: 'p7', name: 'Clean beer lines', category: 'Personal', completed: false, assignedTo: 'Nick' },
  { id: 'p8', name: 'Update staff contact list', category: 'Personal', completed: false, assignedTo: 'Tom' },
  { id: 'p9', name: 'Restock cocktail garnishes', category: 'Personal', completed: false, assignedTo: 'Becca' },
  { id: 'p10', name: 'Clean coffee machine thoroughly', category: 'Personal', completed: false, assignedTo: 'Kim' },
  { id: 'p11', name: 'Check outdoor furniture condition', category: 'Personal', completed: false, assignedTo: 'Col' },
];

const categoryColors: Record<TaskCategory, { bg: string; border: string; text: string }> = {
  Opening: { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.4)', text: '#8b5cf6' },
  Closing: { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.4)', text: '#ec4899' },
  Cellar: { bg: 'rgba(14, 165, 233, 0.2)', border: 'rgba(14, 165, 233, 0.4)', text: '#0ea5e9' },
  Kitchen: { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' },
  Bar: { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b' },
  General: { bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af' },
  Personal: { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.4)', text: '#a855f7' },
};

export default function Tasks() {
  const [selectedStaff, setSelectedStaff] = useState<string>('All');
  const [tasks, setTasks] = useState<Task[]>([...generalTasks, ...personalTasks]);

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedStaff === 'All') {
      return !task.assignedTo; // Show only general tasks when "All" is selected
    } else {
      // Show personal tasks for selected staff + all general tasks
      return !task.assignedTo || task.assignedTo === selectedStaff;
    }
  });

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  // Group tasks: personal first, then by category
  const personalTasksList = sortedTasks.filter(t => t.assignedTo);
  const generalTasksList = sortedTasks.filter(t => !t.assignedTo);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Daily Tasks</h1>
        <p className="text-white/60">The Catherine Wheel • Complete your daily tasks</p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {staffList.map((staff) => {
            const colors = getStaffColor(staff);
            const isSelected = selectedStaff === staff;
            
            return (
              <button
                key={staff}
                onClick={() => setSelectedStaff(staff)}
                className={`px-4 py-2 rounded text-sm font-medium transition-all border ${
                  isSelected ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                }`}
                style={{
                  backgroundColor: isSelected ? colors.bg.replace('0.15', '0.25') : colors.bg,
                  borderColor: isSelected ? colors.border.replace('0.4', '0.6') : colors.border,
                  color: colors.text,
                  ...(isSelected && { 
                    boxShadow: `0 0 0 2px ${colors.border.replace('0.4', '0.3')}`,
                    transform: 'scale(1.05)',
                  }),
                }}
              >
                {staff}
              </button>
            );
          })}
        </div>


      </div>

      {selectedStaff !== 'All' && personalTasksList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Personal Tasks for {selectedStaff}</h2>
          <div className="space-y-3">
            {personalTasksList.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={handleToggleTask}
                isPersonal={true}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedStaff === 'All' ? 'General Daily Tasks' : 'General Tasks'}
        </h2>
        {generalTasksList.length > 0 ? (
          <div className="space-y-3">
            {generalTasksList.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={handleToggleTask}
                isPersonal={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">All tasks completed!</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Great work! All general tasks have been completed for today.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 text-center">
        <p className="text-white/40 text-sm">
          Daily Tasks • The Catherine Wheel • {new Date().toLocaleDateString()}
        </p>
        <p className="text-white/30 text-xs mt-2">
          Staff: {selectedStaff} • Completed: {filteredTasks.filter(t => t.completed).length}/{filteredTasks.length}
        </p>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  isPersonal: boolean;
}

function TaskCard({ task, onToggle, isPersonal }: TaskCardProps) {
  const colors = categoryColors[task.category];
  
  return (
    <div 
      className={`p-4 rounded-xl backdrop-blur-sm border transition-all ${
        task.completed ? 'opacity-60' : 'opacity-100'
      }`}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-primary border-primary' 
              : 'bg-transparent border-white/30'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className={`font-medium ${task.completed ? 'line-through text-white/60' : 'text-white'}`}
              style={{ color: task.completed ? '#9ca3af' : colors.text }}
            >
              {task.name}
            </span>
            {isPersonal && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Personal
              </span>
            )}
          </div>
          {task.assignedTo && (
            <p className="text-white/60 text-sm">
              Assigned to: {
                (() => {
                  const colors = getStaffColor(task.assignedTo);
                  return (
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium border ml-1"
                      style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        color: colors.text,
                      }}
                    >
                      {task.assignedTo}
                    </span>
                  );
                })()
              }
            </p>
          )}
        </div>
        
        <div 
          className="px-3 py-1 rounded text-sm font-medium border"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          {task.category}
        </div>
      </div>
    </div>
  );
}