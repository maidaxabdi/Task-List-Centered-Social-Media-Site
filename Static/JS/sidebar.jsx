
function SideBar() {
    const [showSearch, setShowSearch] = React.useState(false);
    const [showLogout, setShowLogout] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);
    const showLogoutForum = () => { setShowLogout(true); setShowSearch(false); setShowProfile(false) }
    const showSearchResults = () => { setShowSearch(true); setShowLogout(false); setShowProfile(false) }
    const showProfilePage= () => { setShowProfile(true); setShowLogout(false); setShowSearch(false) }
  
    const [searchPost, setSearchPost] = React.useState([]);
    const [searchUser, setSearchUser] = React.useState([]);

    const [seePosts, setSeePosts] = React.useState([])
    const [seeProfile, setSeeProfile] = React.useState([])

    const checkProfile = (profileResponse) => {
    setSeeProfile(profileResponse);
    }
    
    const checkPosts = (postResponse) => {
        setSeePosts(postResponse);
    }
    console.log(seeProfile)
    console.log(seePosts)

    function postSearch(foundPosts) {
        setSearchPost(foundPosts);
    }

   function userSearch(foundUsers) {
        setSearchUser(foundUsers);
     }
     


    return (
        <React.Fragment>
        <h2> Sidebar </h2>  
            <div onClick={showSearchResults}> <SearchBar postSearch={postSearch} userSearch={userSearch} /> </div>
            { showSearch ? < SearchResults checkPosts={checkPosts} checkProfile={checkProfile} seePosts={seePosts} seeProfile={seeProfile} searchPost={searchPost} searchUser={searchUser}/> : null }
            <button onClick={showProfilePage}> Profile </button>
            { showProfile ? <UserProfile /> : null }
            <button onClick={showLogoutForum}> Logout </button>
            { showLogout ? <Logout /> : null }
           
        </React.Fragment>
    )
}
///////////////////////////////////////////// PROFILE //////////////////////////////////////////////////////////////////////////////////////////

// OUTLINE OF POST
function Post(props) {
    // User who posted Profile Picture
    // User who posted username
    // Post title
    // Post text
    // time of post and date of post
    // amount of likes
    return (
        <span className="post">
            <p> {props.name} {props.username} </p>
            <h4> {props.postTitle} </h4>
                    {props.post} 
            <p> {props.dateTime} </p>
        </span>
    );
}

function UsersProfile(props) {
    return (
        <div className="profile">
            {props.profilePic}
            {props.usersName}
            {props.name}
            {props.posts}
            {props.likes}
        </div>
    )
}

// CREATE A NEW POST
function AddPosts(props) {
    const [post, setPost] = React.useState("")
    const [postTitle, setPostTitle] = React.useState("")

    function createPost() {
        fetch('/new-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({postTitle, post}),
        }).then(response => {
            response.json().then(jsonResponse => {
            const {createdPost} = jsonResponse;
            const {postId, post: postText, postTitle: postTitleText} = createdPost;
            props.addPost(postId, postText, postTitleText)
            setPost("")
            setPostTitle("")
            });
        });
  }
    return (
        <React.Fragment>
        <h3> Create a New Post </h3>
        <label htmlFor="postTitleInput"></label>
        <div>
        <input
            value={postTitle}
            placeholder="Post Title"
            onChange={(event) => setPostTitle(event.target.value)}
            id="postTitleInput"
        ></input>
        </div>
        <div>
        <label htmlFor="postInput"></label>
        <input
            value={post}
            placeholder="What's happening?"
            onChange={(event) => setPost(event.target.value)}
            id="postInput"
        ></input>
        </div>
        
        <button onClick={createPost}> Check </button>
        </React.Fragment>
    )
}

// DELETE A PRE-EXISTING POST
function PostDelete(props) {
    function deletePost() {
        fetch('/delete-post', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                },
              body: props.postId,
            }).then(response => {
            response.json().then(jsonResponse => {
            const {deletedPost} = jsonResponse;
            const {postId, post: postText, postTitle: postTitleText} = deletedPost;
            props.deletePost(postId, postText, postTitleText);
            });
        }); 
        }
    return (
        <button value={props.postId} onClick={deletePost}> x </button>
    );
}

// GO TO PROFILE
function UserProfile() {

    const [profileEdit, setProfileEdit] = React.useState([]);
    const [userInfo, setUserInfo] = React.useState([]);

    const [posts, setPosts] = React.useState([]);
    const [deletedPost, setDeletedPost] = React.useState([]);

    React.useEffect(() => {
        fetch('/user-info')
            .then(response => response.json())
            .then(result => setUserInfo(result.userInfo));
    }, [profileEdit]);

    const prof = (
        <div key={userInfo.userId}>
            <UsersProfile
                usersName={userInfo.userName}
                profilePic={userInfo.profilePic}
            />
        </div>
    );
    
    function userEdited(userId, usersName, profilePic) {
        const newEdit= {userId, usersName, profilePic}; 
        setProfileEdit(newEdit);
    }


    function addPost(postId, post, postTitle) {
        const newPost= {postId, post, postTitle}; 
        const currentPosts = [...posts]; 
        setPosts([...currentPosts, newPost]);
    }

    function deletePost(postId, post, postTitle) {
        const currentDeleted= {postId, post, postTitle}; 
        const allDeleted = [...deletedPost]; 
        setDeletedPost([...allDeleted, currentDeleted]);
    }

    React.useEffect(() =>{
        fetch('/posts')
            .then(response => response.json())
            .then(result => setPosts(result.allPosts));
    }, [deletedPost]);

    const addedPosts = [];
    console.log(`posts: `, posts);

    for (const currentPost of posts) {
        addedPosts.push(
            <div key={currentPost.postId}>
            <Post
            postId={currentPost.postId}
            postTitle={currentPost.postTitle}
            post={currentPost.post}
            />
            <PostDelete
            postId={currentPost.postId}
            deletePost={deletePost} 
            />
            </div>
            );
        }

        
    return (
        <React.Fragment>
        <Profile addPost={addPost} userEdited={userEdited} addedPosts={addedPosts} prof={prof}/>
        </React.Fragment>
    )
}

function Profile(props) {
    // const [showEdit, setShowEdit] = React.useState(false)
    // const showEditForum = () => { setShowEdit(true) }

    return (
        <React.Fragment>
        <h2> Show logged in user profile picture, name, username, and edit option to change any of those (maybe bio too?) </h2>
        <div className="grid"> {props.prof} </div>
        {/* <button onClick={showEditForum}> Edit profile </button>
         {showEdit? <EditProfile userEdited={props.userEdited} /> : null }  */}
        <p> logged in user FOLLOWERS and FOLLOWING count and if you click on it you can see pictures/bios/usernames of other users. 
            Can click on those and redirect to those users profile page </p>
        <p> List of users posts and if you click a button can see all of users liked posts  </p>
        <h2> Posts </h2>
        <AddPosts addPost={props.addPost}/>
        <div className="grid"> {props.addedPosts} </div>
        </React.Fragment>
    )
}

// function EditProfile() {
//     const [usersName, setUsersName] = React.useState('');
//     const [previewSource, setPreviewSource] = React.useState('');

//     const editProfile = () => {
//             formData.append('usersName', usersName)
//             fetch('/edit-user', {
//             method: 'POST',
//             body: formData, 
//         }).then(response => {
//             response.json().then(jsonResponse => {
//             const {userEdited} = jsonResponse;
//             const {userId, name: nameText, profilePic: profilePicImg} = userEdited;
//             props.userEdited(userId, nameText, profilePicImg);
//             });
//         });
//      }

//     const formData = new FormData();
//     const reader = new FileReader()
     
//     const whenPicChanges = (e) => {
//          const file = e.target.files[0];
//          formData.append('my-file', file)
//          previewFile(file);
//      }
//      const previewFile = file => {
//         reader.readAsDataURL(file);
//         reader.onloadend = () => {
//             setPreviewSource(reader.result)
//         }
//     }


//     return (
//         <React.Fragment> 
//         <button onClick={editProfile}> save </button>
//         <p> Header </p>
//         <p> Profile Pic </p>
//         <input
//             type="file"
//             accept="image/*"
//             name="my-file"
//             onChange={(e) => whenPicChanges(e)}
//         ></input>
//         {previewSource && (
//             <img src={previewSource} alt="chosen" />
//             )}
//         <p> Name </p>
//         <label htmlFor="nameInput"></label>
//         <input
//             name="usersName"
//             type="text"
//             value={usersName}
//             onChange={(event) => setUsersName(event.target.value)}
//             id="userNameInput"
//         ></input>

//         <p> Bio </p>
//         </React.Fragment>
//     );
// }

/////////////////////////////////////////////////////////////////////////////// SEARCH ////////////////////////////////////////////////////
function User(props) {
    return (
        <span className="user">
            {props.profilePic}
            {props.name}
            {props.username}
            {props.bio}
        </span>
    );
} 

function Post(props) {
    return (
        <span className="post">
            <p> {props.name} {props.username} </p>
            <h4> {props.postTitle} </h4>
                    {props.post} 
            <p> {props.dateTime} </p>
        </span>
    );
}


function SearchBar(props) {
    const [search, setSearch] = React.useState("");

    function StartSearch() {
        console.log(search);
        fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({search}),
        }).then(response => {
            response.json().then(jsonResponse => {
            console.log(jsonResponse)
            const {searchResponse} = jsonResponse;
            props.userSearch(searchResponse[0]);
            props.postSearch(searchResponse[1]);
        });
    });
    }

    return (
        <React.Fragment>
        <label htmlFor="searchInput"></label>
        <input
            placeholder="Search Check"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyPress={event => {
                if (event.key === 'Enter') {
                  StartSearch()
                }}}
            id="searchInput"
        ></input>
        </React.Fragment>
    );
}


function SearchResults(props) {
    const [userResult, setUserResult] = React.useState('')
    const [postResult, setPostResult] = React.useState('')
    const isMountRef = React.useRef(false);
    const [showProfile, setShowProfile] = React.useState(false)
    const [showResults, setShowResults] = React.useState(true)

    const showTheProfile = () => { setShowProfile(true); setShowResults(false) }
  
    const UserDetails = () =>  {
        fetch('/user-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userResult}),
        }).then(response => {
            response.json().then(jsonResponse => {
                console.log(jsonResponse)
                const {Profile} = jsonResponse
                console.log(Profile[1])
                console.log(Profile[0])
                props.checkPosts(Profile[1]);
                props.checkProfile(Profile[0]);
        });
    });
    }

    // function PostDetails() {
    //     fetch('/further-details', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({postResult}),
    //     }).then(response => {
    //         response.json().then(jsonResponse => {
    //         console.log(jsonResponse)
    //         const {postDetails} = jsonResponse;
    //     });
    // });
    // }
    // UserDetails()



    React.useEffect(() => {
        isMountRef.current = true;
        }, []);

    React.useEffect(() => {
        if (isMountRef) {
            UserDetails()
            console.log(userResult)
        }}, [userResult]);

 
   
    return (
        <div>
        { showResults ? 
        <div><div>
                {props.searchUser.map(result => {
                    return (
                        <div key={result.userId} 
                            onClick={() => {{setUserResult(result.userId)}; {showTheProfile()}}} >
                                <User
                                username={result.username} />
                                </div>
                                );
                            })}
                        </div><div>
                {props.searchPost.map(result => {
                    return (
                        <div key={result.postId} onClick={() => setPostResult(result.postId)}>
                            <Post
                            postTitle={result.postTitle}
                            post={result.post} />
                            </div>
                            );
                            })}
                        </div></div>
    : null }
    { showProfile ? <OtherUsers seePosts={props.seePosts} seeProfile={props.seeProfile} /> : null }
    </div>
    );
}

///////////////////////////////////////////////////////// OTHER USERS ////////////////////////////////////////////////////////////

function OtherUsers(props) {
    console.log('Hello from OtherUsers')
    if (props.seePosts && props.seeProfile) {
    return (
        <div>
        {props.seeProfile.map(result => {
            return (
            <div key={result.userId}>
                <User 
                username={result.username}
                />
            </div>
            )
            })}
        {props.seePosts.map(result => {
            return (
            <div key={result.postId}>
                 <Post 
                postTitle={result.postTitle}
                post={result.post}
                />
            </div>
            )
            })}
        </div>
    );
    }
    else {
    return null
    }
    }

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

ReactDOM.render( <SideBar/>, document.getElementById('sidebar'));