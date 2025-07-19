import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map(task => (
          <TaskItem key={task._id} task={task} />
        ))
      )}
    </div>
  );
};

export default TaskList;