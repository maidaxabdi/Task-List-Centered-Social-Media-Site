// OUTLINE FOR MAIN OUTPUT OF THE TASK AND REWARD
function Task(props) {
    return (
        <span className="task">
            {props.urgency}: {props.task}
        </span>
    );
}
function MyReward(props) {
    return (
        <span className="reward">
            {props.reward}
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
    const [reward, setReward] = React.useState('');
    const [target, setTarget] = React.useState('begin');
    
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
            props.completeTask(taskIdText, taskText, urgencyText, activeBoolean);
        });
    }); 
    }

    React.useEffect(() =>{
        fetch('/random-reward')
            .then(response => response.json())
            .then(result => setReward(result.randomReward));
    }, [target]);

    
    function countCompleted() {    
        let amountSet = props.amount;
        let tasksCompleted = props.completed;
        console.log(amountSet)
        console.log(tasksCompleted)
        if (tasksCompleted % amountSet === 0) {
            setTarget('received');
            alert(`Congratulations! You have earned: ${reward}`);
        }
    }


    return (
        <button value={props.taskId} onClick={() => {{deactivateTask()}; {countCompleted()}}}>Check</button>
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
// ENDTASK FUNCTION ACCOUNTS FOR TASKS COMPLETED AND DELETED SO USEEFFECT CAN ONLY SHOW CURRENT TASKS
 function TaskList() {
    const [tasks, setTasks] = React.useState([]);
    const [rewards, setRewards] = React.useState([]);
    const [ended, setEndTask] = React.useState([]);
    const [added, setAdded] = React.useState([]);
    const [taskComplete, setTaskComplete] = React.useState([]);
    const [completed, setCompleted] = React.useState([]);
    const [newAmount, setNewAmount] = React.useState([]);
    const [amount, setAmount] = React.useState('');
    const [showRewards, setShowRewards] = React.useState(false);
    const [showLogout, setShowLogout] = React.useState(false);

    const showRewardForum = () => { setShowRewards(true); setShowLogout(false) }
    const showLogoutForum = () => { setShowLogout(true); setShowRewards(false) }


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
    // console.log(`tasks: `, tasks);
    for (const currentTask of tasks) {
        if (currentTask.active === true) {
            addedTask.push(
                <div key={currentTask.taskId}>
                <TaskComplete
                endTask={endTask}
                amount={amount} 
                taskId={currentTask.taskId}
                completeTask={completeTask}
                completed={completed}
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

    function editReward(rewardId, reward) {
        const currentAdded= {rewardId, reward}; 
        const allAdded = [...added]; 
        setAdded([...allAdded, currentAdded]);
    }

    React.useEffect(() =>{
        fetch('/reward')
            .then(response => response.json())
            .then(result => setRewards(result.allRewards));
    }, [added]);

    const listRewards = [];
    // console.log(`rewards: `, rewards);
    for (const currentReward of rewards) {
            listRewards.push(
                <div key={currentReward.rewardId}>
                <MyReward
                rewardId={currentReward.rewardId}
                reward={currentReward.reward}
                /> 
                <RewardDelete
                editReward={editReward} 
                rewardId={currentReward.rewardId}
                />
                </div>
                );
        
        }

    function changedAmount(amount) {
        const {changeAmount}= {amount}; 
        setNewAmount([changeAmount]);
    }

    React.useEffect(() =>{
        fetch('/amount')
            .then(response => response.json())
            .then(result => setAmount(result.afterCompleted));
            console.log(amount);
        }, [newAmount]); 

    function completeTask(taskId, task, urgency, active) {
        const {doneTask}= {taskId, task, urgency, active};
        setTaskComplete([doneTask]);
        } 

    React.useEffect(() => {
        fetch('/completed-tasks')
            .then(response => response.json())
            .then(result => setCompleted(result.completed));
        }, [completeTask]);

    return (
        <React.Fragment>
            <h1> Task List </h1>
            <AddTheTask addTask={addTask}/>
            <h2> Tasks </h2>
            <div className="grid">{addedTask}</div>
            <h2> Sidebar </h2>
            <button onClick={showRewardForum}> Rewards </button>
            { showRewards ? <ListRewards editReward={editReward} rewardList={listRewards} changedAmount={changedAmount}/> : null }
            <button onClick={showLogoutForum}> Logout </button>
            { showLogout ? <Logout /> : null }
        </React.Fragment>
    );
}

// LOG USER OUT

function Logout() {

    return (
        <div>
        <h3>Log out of Check? </h3>
        <p>You can always log back in at any time. 
        If you just want to switch accounts, you can do that by adding an existing account. </p>
        <form action="/log-out" method="POST">
	    <button submit="submit"> Log Out </button>
        </form>
        <form action="/home">
	    <button submit="submit"> Cancel </button>
        </form>
        </div>
    );
    }

// ASKS USER HOW MANY TASKS THEY WANT TO COMPLETE FOR REWARD
function AmountForum(props) {
    const [amount, setAmount] = React.useState('')
    function createAmount() {
        if (!isNaN(+`${amount}`)) {
            fetch('/create-amount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify({amount}),
            }).then(response => {
            response.json().then(jsonResponse => {
            const {amountWantedDone} = jsonResponse;
            const {amount: amountText}  = amountWantedDone;
            props.changedAmount(amountText);
            console.log(amount);
            });
            }); 
            }
        else {
            alert('Invalid: Input Needs to be a Number');
        }
    }
    return (
    <div>
    <label htmlFor="amountInput"></label>
        <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            id="amountInput"
        ></input>
        <button onClick={createAmount}> After x Amount of Tasks </button>
        </div>
);
}

// USER CAN DELETE REWARDS FROM DATABASE
function RewardDelete(props) {
    function deleteReward() {
        fetch('/delete-reward', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                },
              body: props.rewardId,
            }).then(response => {
            response.json().then(jsonResponse => {
            const {deletedReward} = jsonResponse;
            const {rewardId, reward: rewardText} = deletedReward;
            props.editReward(rewardId, rewardText);
            });
        }); 
        }
    return (
        <a value={props.rewardId} onClick={deleteReward}> x </a>
    );
}

// SHOWS ALL REWARDS IN SYSTEM
function ListRewards(props) {
    const [reward, setReward] = React.useState([])
    const [showAmount, setShowAmount] = React.useState(false)

    const changeAmount = () => {setShowAmount(true)};

    function createReward() {
        fetch('/create-reward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
          body: JSON.stringify({reward}),
        }).then(response => {
        response.json().then(jsonResponse => {
        const {rewardCreated} = jsonResponse;
        const {rewardId, reward: rewardText} = rewardCreated;
        props.editReward(rewardId, rewardText);
        });
    }); 
    }
    return (
        <div>
            <h2> Rewards </h2>
            <p> Add to your list of rewards </p>
            <label htmlFor="rewardInput"></label>
            <input
                value={reward}
                onChange={(event) => setReward(event.target.value)}
                id="rewardInput"
            ></input>
            <button onClick={createReward}> Add to Rewards </button>
            <h3> Current Rewards: </h3>
            <div className="grid">{props.rewardList}</div>
            <p> Do you wish to change the number of tasks you need to complete before receiving a reward? 
                <a onClick={changeAmount}> <u> Yes </u> </a> </p>
                { showAmount ? <AmountForum changedAmount={props.changedAmount} /> : null }
        </div>
        );
}
ReactDOM.render(<TaskList />, document.getElementById('taskList'));