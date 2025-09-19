import { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "../../components/task/kanban/Column";
import { Task } from "../../components/task/kanban/types/types";

/** School-flavored initial tasks */
const initialTasks: Task[] = [
  // -------- To Do --------
  {
    id: "1",
    title: "Draft Week 3 Lesson Plan — Grade 5 Math",
    dueDate: "Tomorrow",
    comments: 1,
    assignee: "/images/user/user-03.jpg",
    status: "todo",
    category: { name: "Lesson Plan", color: "brand" },
  },
  {
    id: "2",
    title: "Post Homework Set A to LMS — Grade 3 Science",
    dueDate: "Today",
    comments: 2,
    assignee: "/images/user/user-05.jpg",
    status: "todo",
    category: { name: "LMS", color: "brand" },
    links: 1,
  },
  {
    id: "3",
    title: "Submit print request for module packets — G7–G10 English",
    dueDate: "Sep 20",
    assignee: "/images/user/user-07.jpg",
    status: "todo",
    category: { name: "Admin", color: "default" },
  },
  {
    id: "4",
    title: "Prepare Quiz #1 items — Grade 5 Math",
    dueDate: "This Week",
    comments: 1,
    assignee: "/images/user/user-01.jpg",
    status: "todo",
    category: { name: "Assessment", color: "orange" },
  },

  // -------- In Progress --------
  {
    id: "5",
    title: "Check Quiz #1 — Grade 3 Science",
    dueDate: "Today",
    comments: 6,
    assignee: "/images/user/user-09.jpg",
    status: "inProgress",
    category: { name: "Grading", color: "success" },
    links: 2,
  },
  {
    id: "6",
    title: "Record Q1 Scores in SIS",
    dueDate: "Next Mon",
    comments: 3,
    assignee: "/images/user/user-10.jpg",
    status: "inProgress",
    category: { name: "Grading", color: "success" },
  },
  {
    id: "7",
    title: "Schedule Parent–Teacher Conferences — Romans (Advisory)",
    dueDate: "Fri, 3 PM",
    comments: 2,
    assignee: "/images/user/user-12.jpg",
    status: "inProgress",
    category: { name: "Advisory", color: "orange" },
  },
  {
    id: "8",
    title: "Prepare lesson slides — Week 3 (Grade 5 Math)",
    projectDesc:
      "Key examples, practice problems, and exit tickets for the week.",
    projectImg: "/images/task/task.png",
    dueDate: "Today",
    comments: 1,
    assignee: "/images/user/user-02.jpg",
    status: "inProgress",
    category: { name: "Lesson Plan", color: "brand" },
  },

  // -------- Completed --------
  {
    id: "9",
    title: "Advisory attendance audit — August",
    dueDate: "Aug 30",
    comments: 1,
    assignee: "/images/user/user-13.jpg",
    status: "completed",
    category: { name: "Advisory", color: "orange" },
  },
  {
    id: "10",
    title: "Club roster finalized — Robotics",
    dueDate: "Aug 28",
    comments: 2,
    assignee: "/images/user/user-10.jpg",
    status: "completed",
    category: { name: "Admin", color: "default" },
    links: 1,
  },
  {
    id: "11",
    title: "Orientation deck posted on LMS — All sections",
    dueDate: "Aug 27",
    comments: 2,
    assignee: "/images/user/user-14.jpg",
    status: "completed",
    category: { name: "LMS", color: "brand" },
  },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDragging, setIsDragging] = useState(false);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  }, []);

  const changeTaskStatus = useCallback((taskId: string, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-7 grid grid-cols-1 divide-x divide-gray-200 border-t border-gray-200 dark:divide-white/[0.05] dark:border-white/[0.05] sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">
        <Column
          title="To Do"
          tasks={tasks.filter((task) => task.status === "todo")}
          status="todo"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          isDragging={isDragging}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <Column
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "inProgress")}
          status="inProgress"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          isDragging={isDragging}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <Column
          title="Completed"
          tasks={tasks.filter((task) => task.status === "completed")}
          status="completed"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          isDragging={isDragging}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;