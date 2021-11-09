// OUTLINE FOR MAIN OUTPUT OF THE TASK
function Task(props) {
    return (
        <span className="task">
            {props.urgency}: {props.task}
        </span>
    );
}

// HTML OUTPUT TO GET USERS TASK INPUT AND THEN CONNECT TO FLASK IN ORDER TO ADD IT TO DATABASE
// THEN VALUES RETRIEVED PUSHED TO FUNCTION THAT WILL RIGHT AWAY ADD TASK TO LIST
function AddTheTask(props) {
    const [task, setTask] = React.useState("");
    const [urgency, setUrgency] = React.useState("");
    function addNewTask() {
        fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({task, urgency}),
        }).then(response => {
            response.json().then(jsonResponse => {
            const {addedTask} = jsonResponse;
            const {taskId, task: taskText, urgency: urgencyText, active: activeBoolean} = addedTask;
            props.addTask(taskId, taskText, urgencyText, activeBoolean);
        });
    });
    }
    return (
        <React.Fragment>
        <label htmlFor="urgencyInput"></label>
        <select value={urgency} onChange={(event) => setUrgency(event.target.value)} id="urgencyInput">
            <option value="None">Urgency</option>
            <option value="green">Low</option>
            <option value="blue">Medium</option>
            <option value="orange">High</option>
            <option value="red">Critical</option>
        </select>
        <label htmlFor="taskInput"></label>
        <input
            value={task}
            onChange={(event) => setTask(event.target.value)}
            id="taskInput"
        ></input>
        <button onClick={addNewTask}> Add </button>
        </React.Fragment>
    );
 }

 // IF USER COMPLETED TASK THEY CAN NOTIFY DATABASE SO WHEN THEIR LIST OF CURRENT TASKS PRINTS ON WEBSITE
 // THE USER WILL ONLY SEE CURRENTLY ACTIVE TASKS

 function TaskComplete(props) {
    function deactivateTask() {
        fetch('/deactivate-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.taskId,
        }).then(response => {
            response.json().then(jsonResponse => {
            const {completedTask} = jsonResponse;
            const {taskId: taskIdText, task: taskText, urgency: urgencyText, active: activeBoolean} = completedTask;
            props.endTask(taskIdText, taskText, urgencyText, activeBoolean);
        });
    }); 
    }
    return (
        <button value={props.taskId} onClick={deactivateTask}>Check</button>
    );
 }

 // IF USER DOESN'T WANT TO DO TASK ANYMORE THEY CAN DELETE IT FROM DATABASE
 function TaskDelete(props) {
    function deleteTask() {
        fetch('/delete-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.taskId,
            }).then(response => {
                response.json().then(jsonResponse => {
                const {deletedTask} = jsonResponse;
                const {taskId, task: taskText, urgency: urgencyText, active: activeBoolean} = deletedTask;
                props.endTask(taskId, taskText, urgencyText, activeBoolean);
            });
        });
        }

    return (
        <button value={props.taskId} onClick={deleteTask}>Delete</button>
    );
 }

// RETURNS ALL TASKS THAT SHOULD BE IN TASKLIST AND CONNECTS TO OUTLINE IN FIRST FUNCTION
// ADDTASK FUNCTION TAKES DATA RETRIEVED FROM FETCH/FROM USER INPUT AND PUTS INSIDE TASKLIST WE WANT TO RETURN TO PAGE
 function TaskList() {
    const [tasks, setTasks] = React.useState([]);
    const [ended, setEndTask] = React.useState([]);

    function addTask(taskId, task, urgency, active) {
        const newTask= {taskId, task, urgency, active}; 
        const currentTasks = [...tasks]; 
        setTasks([...currentTasks, newTask]);
    }
    
    function endTask(taskId, task, urgency, active) {
        const currentEnded= {taskId, task, urgency, active}; 
        const allEnded = [...ended]; 
        setEndTask([...allEnded, currentEnded]);
    }
    
    React.useEffect(() =>{
        fetch('/tasks')
            .then(response => response.json())
            .then(result => setTasks(result.allTasks));
    }, [ended]);

    const addedTask = [];
    console.log(`tasks: `, tasks);
    for (const currentTask of tasks) {
        if (currentTask.active === true) {
            addedTask.push(
                <div key={currentTask.taskId}>
                <TaskComplete
                endTask={endTask} 
                taskId={currentTask.taskId}
                /> 
                <Task
                taskId={currentTask.taskId}
                task={currentTask.task}
                urgency={currentTask.urgency}
                />
                <TaskDelete
                endTask={endTask} 
                taskId={currentTask.taskId}
                />
                </div>
                );
        }
        }
    
    return (
        <React.Fragment>
            <AddTheTask addTask={addTask}/>
            <h2> Tasks </h2>
            <div className="grid">{addedTask}</div>
        </React.Fragment>
    );
}


ReactDOM.render(<TaskList />, document.getElementById('taskList'));

