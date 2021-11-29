
function SideBar() {
    const [showSearch, setShowSearch] = React.useState(false);
    const [showLogout, setShowLogout] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);
    const [showHome, setShowHome] = React.useState(true);

    const showLogoutForum = () => { setShowHome(false); setShowLogout(true); setShowSearch(false); setShowProfile(false) }
    const showSearchResults = () => { setShowHome(false); setShowSearch(true); setShowLogout(false); setShowProfile(false) }
    const showProfilePage= () => { setShowHome(false); setShowProfile(true); setShowLogout(false); setShowSearch(false) }
    
    const showHomePage= () => { setShowHome(true); setShowProfile(false); setShowLogout(false); setShowSearch(false) }
  
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
     

     console.log(searchUser)
     console.log(searchPost)
    return (
        <React.Fragment>
        <h2> Sidebar </h2>  
            <div onClick={showSearchResults}> <SearchBar postSearch={postSearch} userSearch={userSearch} /> </div>
            { showSearch ? < SearchResults checkPosts={checkPosts} checkProfile={checkProfile} seePosts={seePosts} seeProfile={seeProfile} searchPost={searchPost} searchUser={searchUser}/> : null }
            <button onClick={showProfilePage}> Profile </button>
            { showProfile ? <UserProfile /> : null }
            <button onClick={showLogoutForum}> Logout </button>
            { showLogout ? <Logout /> : null }
            <button onClick={showHomePage}> Home </button>
            { showHome ? <Home /> : null}

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
    // console.log(props.profilePic)
    // console.log(props.name)
    return (
        <div className="post"> 
            <img className="resize"  src={props.profilePic}/>
                    <span >{props.name} </span>
                    <span> {props.username} </span>
            <h4> {props.postTitle} </h4>
                    {props.post} 
            <p> {props.postDate} </p>
        </div>
    );
}

// function UsersProfile(props) {
//     return (
//         <div className="profile">
//             {/* <img className="resize"  src={props.profilePic}/> */}
//             <span> {props.username} </span>
//             <span> {props.name} </span>
//             {props.posts}
//             {props.likes}
//         </div>
//     )
// }

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
            <UserHeader
                name={userInfo.name}
                username={userInfo.username}
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
            profilePic={currentPost.profilePic}
            username={currentPost.username}
            name={currentPost.name}
            postId={currentPost.postId}
            postTitle={currentPost.postTitle}
            post={currentPost.post}
            postDate={currentPost.postDate}
            />
            <PostDelete
            postId={currentPost.postId}
            deletePost={deletePost} 
            />
            </div>
            );
        }

        console.log(addedPosts)
    return (
        <React.Fragment>
        <Profile addPost={addPost} userEdited={userEdited} addedPosts={addedPosts} prof={prof}/>
        </React.Fragment>
    )
}

function Profile(props) {
    const [showEdit, setShowEdit] = React.useState(false)
    const showEditForum = () => { setShowEdit(true) }

    return (
        <React.Fragment> 
        <div className="grid"> {props.prof} </div>
        <EditProfile userEdited={props.userEdited} /> 
        <h2> Posts </h2>
        <AddPosts addPost={props.addPost}/>
        <div className="grid"> {props.addedPosts} </div>
        </React.Fragment>
    )
}

function EditProfile(props) {
    const [usersName, setUsersName] = React.useState('');
    const [previewSource, setPreviewSource] = React.useState('');
    const [showEdit, setShowEdit] = React.useState(false)

    const ShowEditChange = () => {setShowEdit(!showEdit)}

    const editProfile = () => {
        console.log(formData.get('my-file'))
            fetch('/edit-pic', {
            method: 'POST',
            body: formData, 
        }).then(response => {
            response.json().then(jsonResponse => {
            const {editedProfile} = jsonResponse;
            console.log(editedProfile)
            const {userId: userIdText,  name: nameText, profilePic: profilePicImg} = editedProfile;
            props.userEdited(userIdText, nameText, profilePicImg);
            });
        });
     }

    const formData = new FormData();
    const reader = new FileReader()
     
    const whenPicChanges = (e) => {
         const file = e.target.files[0];
         console.log(file)
         formData.append('my-file', file)
         console.log(formData.get('my-file'))
         formData.append('name', usersName)
         editProfile()
         previewFile(file);
     }

     const previewFile = file => {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }
    const editUser = () => {
        ShowEditChange()
        console.log(usersName)
            fetch('/edit-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({usersName}), 
        }).then(response => {
            response.json().then(jsonResponse => {
            const {editedProfile} = jsonResponse;
            console.log(editedProfile)
            const {userId: userIdText, name: nameText} = editedProfile;
            props.userEdited(userIdText, nameText);
            });
        });
     }
    return (
        <React.Fragment> 
        <button onClick={ShowEditChange}> Edit profile </button>
        {showEdit ?
        <div>
        <button onClick={editUser}> save </button> 
        <p> Profile Pic </p>
        <input
            type="file"
            accept="image/*"
            name="my-file"
            onChange={(e) => whenPicChanges(e)}
        ></input>
        {previewSource && (
            <img src={previewSource} alt="chosen" />
            )}
        <p> Name </p>
        <label htmlFor="nameInput"></label>
        <input
            name="usersName"
            type="text"
            value={usersName}
            onChange={(e) => setUsersName(e.target.value)}
            id="userNameInput"
        ></input>
        </div>
        : null }
        </React.Fragment>
    );
}

/////////////////////////////////////////////////////////////////////////////// SEARCH ////////////////////////////////////////////////////


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
            console.log(searchResponse[0])
            console.log(searchResponse[1])
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
    const [showProfile, setShowProfile] = React.useState(false)
    const [showResults, setShowResults] = React.useState(true)

    const showTheProfile = () => {
         setShowProfile(true); setShowResults(false) 
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


    return (
        <div>
        {  showResults ?
        <div>
            <div>
                {props.searchUser.map(result => {
                    return (
                        <div key={result.userId} 
                            onClick={() => {{setUserResult(result.userId)}; {showTheProfile()}}} >
                                <UserHeader
                                username={result.username} 
                                name={result.name}
                                profilePic={result.profilePic}
                                />
                                </div>
                                );
                            })}
                        </div>
                        <div>
                {props.searchPost.map(result => {
                    return (
                        <div key={result.postId} onClick={() => setPostResult(result.postId)}>
                            <Post
                            postTitle={result.postTitle}
                            post={result.post} 
                            username={result.username}
                            profilePic={result.profilePic}
                            name={result.name}
                            postDate={result.postDate}
                            />
                            </div>
                            );
                            })}
                        </div></div>
                    : null}
    { showProfile ? <UserDetails userResult={userResult} checkPosts={props.checkPosts} checkProfile={props.checkProfile}  seePosts={props.seePosts} seeProfile={props.seeProfile} /> : null }
    </div>
    );
}

///////////////////////////////////////////////////////// OTHER USERS ////////////////////////////////////////////////////////////
function UserHeader (props) {
    return (
        <div className="user">
            <img className="resize" src={props.profilePic}/>
            <span> {props.name} </span>
            <span> {props.username} </span>
            {props.bio}
        </div>
    );
}

function User(props) {
    const [added, setAdded] = React.useState([])
    const [followed, setFollowed] = React.useState([])
    const [showProfile, setShowProfile] = React.useState(false)
    

    const following = (userFollowed) => {
        setAdded(userFollowed)
    }

    const allFollowing = (userFollowed) => {
        setFollowed(userFollowed)
    }
    const [seePosts, setSeePosts] = React.useState([])
    const [seeProfile, setSeeProfile] = React.useState([])

    const checkProfile = (profileResponse) => {
    setSeeProfile(profileResponse);
    }
    
    const checkPosts = (postResponse) => {
        setSeePosts(postResponse);
    }


    return (
        <div>
        <div className="user">
            <img className="resize"  src={props.profilePic}/>
            {props.name}
            {props.username}
            {props.bio}
            <FollowUser
            following={following}
            userId={props.userId}/>
            <RetrieveFollowed 
            checkPosts={checkPosts} 
            checkProfile={checkProfile} 
            seePosts={seePosts} 
            seeProfile={seeProfile}
            userId={props.userId}
            allFollowing={allFollowing}
            followed={followed}/>
        </div>
        </div>
    );
} 

function UserDetails(props) {
    const isMountRef = React.useRef(false);
    
    let user;
    if (props.userResult) {
        user = props.userResult;
    }
    else if (props.userResultFollowing) {
        user = props.userResultFollowing;
    }
   
    const UserDetail = () =>  {
        fetch('/user-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: user,
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

    React.useEffect(() => {
        isMountRef.current = true}, []);

    React.useEffect(() => {
        if (isMountRef && props.seeProfile && props.seePosts) {
            console.log('here')
            UserDetail()
        }}, []);
        
    return (
        <div>
        {props.seeProfile.map(result => {
            return (
            <div key={result.userId}>
                <User 
                username={result.username}
                userId={result.userId}
                profilePic={result.profilePic}
                name={result.name}
                />
            </div>
            )
            })}
        {props.seePosts.map(result => {
            return (
            <div key={result.postId}>
                 <Post 
                name={result.name}
                profilePic={result.profilePic}
                username={result.username}
                postTitle={result.postTitle}
                post={result.post}
                postDate={result.postDate}
                />
            </div>
            )
            })}
        </div>
    );
    }

function FollowUser(props) {
    const [follow, setFollow] = React.useState("Follow")
    const [followed, setFollowed] = React.useState(false)

    function followThem() {
        fetch('/follow-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.userId,
        }).then(response => {
            response.json().then(jsonResponse => {
            const {userFollowed} = jsonResponse;   
            console.log(userFollowed)
            props.following(userFollowed) 
        });
    }); 
    }

    // function handleFollow() {
    //     followThem()
    //     setFollow("Following")
    // }
    // function handleUnfollow() {
    //     setFollow("Follow")
    // }

    // function UnFollow() {

    // }
    
    return (
        <button value={props.userId} onClick={() => {setFollowed(!followed); {followThem()}}}>
            {followed ? 'Following' : 'Follow'}
        </button>
    );
}

function RetrieveFollowed(props) {
    const isMountRef = React.useRef(false);
    const [userResultFollowing, setUserResultFollowing] = React.useState('')

    const [showProfile, setShowProfile] = React.useState(false)
    const [showResults, setShowResults] = React.useState(true)

    const showTheProfile = () => {
         setShowProfile(true); setShowResults(false) 
    }
    const showTheResults = () => {
        setShowProfile(false); setShowResults(true) 
   }

    function Following() {
        fetch('/following', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.userId,
        }).then(response => {
            response.json().then(jsonResponse => {
            const {everyoneFollowed} = jsonResponse;   
            console.log(everyoneFollowed)
            props.allFollowing(everyoneFollowed) 
        });
    }); 
    }
    React.useEffect(() => {
        isMountRef.current = true;
        }, []);

    React.useEffect(() => {
        if (isMountRef) {
            showTheResults()
        }}, []);

    console.log(showProfile)
    console.log(showResults)
    return (
        <div>
        <button onClick={Following}> Following </button>
        { showResults ?
        <div>
        {props.followed.map(result => {
            return (
            <div key={result.userId} onClick={() => {setUserResultFollowing(result.userId); showTheProfile()}}>
                <UserHeader
                username={result.username}
                profilePic={result.profilePic}
                name={result.name}
                />
            </div>
            )
            })}
        </div>
        : null}
        {showProfile ? <UserDetails userResultFollowing={userResultFollowing} checkPosts={props.checkPosts} checkProfile={props.checkProfile} seePosts={props.seePosts} seeProfile={props.seeProfile}/> : console.log('Cant do')}
        </div>
    );
}

//////////////////////////////////////////////////////// HOME /////////////////////////////////////////////////////////////

function Home() {
    const [posts, setPosts] = React.useState([])
    React.useEffect(() =>{
        fetch('/home-posts')
            .then(response => response.json())
            .then(result => setPosts(result.allPosts));
    }, []);

    return (
        <div>
        {posts.map(result => {
            return (
            <div key={result.postId}>
                <Post
                    postTitle={result.postTitle}
                    post={result.post} 
                    username={result.username}
                    profilePic={result.profilePic}
                    name={result.name}
                    postDate={result.postDate}
                />
            </div>
            )
            })}
        </div>
    );
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