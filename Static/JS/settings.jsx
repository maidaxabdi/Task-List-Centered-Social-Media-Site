// NO FUNCTIONALITY YET - IN PROGRESS 

function MainBar() {
    // const [setting, setSetting] = React.useState("");
    // function settingsInput() 
    
    // return 
    // }
    
    // 
    return (
        <React.Fragment>
            <button> Home </button>
            <button> Notifications </button>
            <button> Messages </button>
            <button> Groups </button>
            <button> Profile </button>
            <select>
                <option defaultValue="home">More</option>
                <option value="rewards">Rewards</option>
                <option value="reminders">Reminders</option>
                <option value="privacy">Privacy</option>
                <option value="night mode">Night Mode</option>
                <option value="delete account">Delete Account</option>
            </select>
        </React.Fragment>
    )
}

ReactDOM.render(<MainBar />, document.getElementById('main'));
