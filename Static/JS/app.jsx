
const App = () => {
    const [loggedIn, setLoggedIn] = React.useState(false); 
    const [showLogin, setShowLogin] = React.useState(true);
    const [user, setUser] = React.useState([])

    const userRight = (userInfo) => {
        if (userInfo != null) {
            setLoggedIn(true)
            setShowLogin(false)
            setUser(userInfo)
        }
    }
    const [showLogout, setShowLogout] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);
    const [showHome, setShowHome] = React.useState(true);
    const [showResults, setShowResults] = React.useState(false);

    console.log(showResults)
    const showLogoutForum = () => { setShowResults(false); setShowHome(false); setShowLogout(true); setShowProfile(false) }
    const showProfilePage= () => { setShowResults(false); setShowHome(false); setShowProfile(true); setShowLogout(false) }
    const showHomePage= () => { setShowResults(false); setShowHome(true); setShowProfile(false); setShowLogout(false)}
    const showSearchResults= () => { setShowResults(true); setShowHome(false); setShowProfile(false); setShowLogout(false)}

    return (
        <ReactBootstrap.Container>
        { showLogin ? 
        <ReactBootstrap.Row className="justify-content-md-center">
        <ReactBootstrap.Col col-6>
            <ReactBootstrap.Image src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png" fluid /> 
        </ReactBootstrap.Col>
        <ReactBootstrap.Col lg>
            <Login userRight={userRight} /> 
        </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        : null}
        { loggedIn ? 
        <ReactBootstrap.Row className="justify-content-md-center">
        <ReactBootstrap.Col lg>
            <TaskList />
        </ReactBootstrap.Col>
        <ReactBootstrap.Col lg>
        { showHome ? <Home path='/home'/> : null}
        { showProfile ? <UserProfile path='/profile' /> : null }
        { showLogout ? <Logout path='/' /> : null }
        </ReactBootstrap.Col>
        <ReactBootstrap.Col lg>
        <SearchBar  
        showResults={showResults}
        showSearchResults={showSearchResults}
        /> 
        <div><button className='button' onClick={showHomePage}> Home </button></div>
        <div><button className='button' onClick={showProfilePage}> Profile </button></div>
        <div><button className='button' onClick={showLogoutForum}> Logout </button></div>
        </ReactBootstrap.Col>
        {/* <Logout show={loggedIn} onHide={() => setLoggedIn(false)}/> */}
        </ReactBootstrap.Row>
        : null}
        </ReactBootstrap.Container>
    );
}


function Login (props) {
    const [showSignup, setShowSignup] = React.useState(false);
    const [showSignin, setShowSignin] = React.useState(false);
    
        return (
            <React.Fragment>
            <h1> <b> Happening now </b></h1>
            <h3> <b> Join Check today. </b> </h3> 
    
            <button className='button' variant="primary" onClick={() => setShowSignup(true)}>
            Sign up with email
            </button>
    
            <SignUp
            show={showSignup}
            onHide={() => setShowSignup(false)}
            />
    
            <h5> <b> Already have an account?  </b> </h5>
            <button className='button' variant="primary" onClick={() => setShowSignin(true)}>
            Sign in
            </button>
    
            <SignIn
            show={showSignin}
            onHide={() => setShowSignin(false)}
            userRight={props.userRight}
            />
        </React.Fragment>
        );
    }
            
    function SignUp (props) {
        const [username, setUsername] = React.useState('')
        const [password, setPassword] = React.useState('')
        const [email, setEmail] = React.useState('')
    
        function AddNewUser() {
            fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({username, email, password}),
            }).then(response => {
                response.json().then(jsonResponse => {
                const {userCreated} = jsonResponse;
                });
            });
      }
            return (
            <ReactBootstrap.Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title id="contained-modal-title-vcenter">
              Create your account
            </ReactBootstrap.Modal.Title>
            </ReactBootstrap.Modal.Header>
            <ReactBootstrap.Modal.Body>
            <input
                value={email}
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                id="emailInput"
            ></input>
              <input
                value={username}
                placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
                id="usernameInput"
            ></input>
              <input
                value={password}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                id="passwordInput"
            ></input>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer>
            <button onClick={() => {props.onHide; AddNewUser()}}>Sign up</button>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal>
      );
    }
    
    function SignIn (props) {
        const { userRight, onHide, ...rest } = props
        const [password, setPassword] = React.useState('')
        const [email, setEmail] = React.useState('')
    
        function loginUser() {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({email, password}),
            }).then(response => {
                response.json().then(jsonResponse => {
                console.log(jsonResponse)
                props.userRight(jsonResponse)
                });
            });
      }
        return (
        <ReactBootstrap.Modal
            {...rest}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
      <ReactBootstrap.Modal.Header closeButton>
        <ReactBootstrap.Modal.Title id="contained-modal-title-vcenter">
          Sign in to Check
        </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
        <form>
            <input
                value={email}
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                id="emailInput"
            ></input>
              <input
                value={password}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                id="passwordInput"
            ></input>
        </form>
      </ReactBootstrap.Modal.Body>
      <ReactBootstrap.Modal.Footer>
        <button onClick={() => {props.onHide; loginUser()}}>Sign in</button>
      </ReactBootstrap.Modal.Footer>
    </ReactBootstrap.Modal>
    );
    }


///////////////////////////////////////////// PROFILE //////////////////////////////////////////////////////////////////////////////////////////

// OUTLINE OF POST
function Post(props) {

    return (
        <ReactBootstrap.Card style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Header > 
        <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/>
        {props.name}  <span className="font-weight-light" > @{props.username} </span>
        </ReactBootstrap.Card.Header>
        <ReactBootstrap.Card.Body>
        <ReactBootstrap.Card.Title>{props.postTitle}</ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Text>
        <p className="text-md-left"> {props.post} </p>
        <p className="text-sm-left" className="font-weight-light" > {props.postDate} </p>
        </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
    );
}

// OUTLINE OF USER POST
function UserPost(props) {

    return (
        <ReactBootstrap.Card style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Header > 
        <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/>
        {props.name}  <span className="font-weight-light" > @{props.username} </span>
        </ReactBootstrap.Card.Header>
        <ReactBootstrap.Card.Body>
        <ReactBootstrap.Card.Title>{props.postTitle}</ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Text>
        <p class="text-md-left"> {props.post} </p>
        <p class="text-sm-left" class="font-weight-light" > {props.postDate} </p>
        </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
        <p class="text-right">
        <PostDelete postId={props.postId}
        deletePost={props.deletePost} />
        </p>
        </ReactBootstrap.Card>
    );
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
            const {postId, post: postText, postTitle: postTitleText, profilePic: profilePicIMG, username: usernameText, name: nameText} = createdPost;
            props.addPost(postId, postText, postTitleText, profilePicIMG, usernameText, nameText)
            setPost("")
            setPostTitle("")
            });
        });
  }

    return (
        
        <ReactBootstrap.Card style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Body>
        <div>
        <input
            value={postTitle}
            placeholder="Post Title"
            onChange={(event) => setPostTitle(event.target.value)}
            id="postTitleInput"
        ></input>
        </div>
        <div>
       <textarea
            value={post}
            placeholder="What's happening?"
            onChange={(event) => setPost(event.target.value)}
            id="postInput"
        ></textarea>
        </div>
        </ReactBootstrap.Card.Body>
        <button className="checkButton" onClick={createPost}> Check </button> 
        </ReactBootstrap.Card>
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
        <button type="button" className="btn-close" aria-label="Close" value={props.postId} onClick={deletePost}></button>
    );
}

// GO TO PROFILE
function UserProfile() {

    const [profileEdit, setProfileEdit] = React.useState([]);
    const [userInfo, setUserInfo] = React.useState([]);
 
    const [posts, setPosts] = React.useState([]);
    const [deletedPost, setDeletedPost] = React.useState([]);

    const [showEdit, setShowEdit] = React.useState(false)

    React.useEffect(() => {
        fetch('/user-info')
            .then(response => response.json())
            .then(result => setUserInfo(result.userInfo));
    }, [profileEdit]);

    React.useEffect(() =>{
        fetch('/posts')
            .then(response => response.json())
            .then(result => setPosts(result.allPosts));
    }, [profileEdit]);
    
    const prof = (
        <div key={userInfo.userId}>
            <UserHeader
                name={userInfo.name}
                username={userInfo.username}
                profilePic={userInfo.profilePic}
                bio={userInfo.bio}
            />
        </div>
    );

    
    function userEdited(newEdit) {
        setProfileEdit(newEdit);
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
            <UserPost
            profilePic={currentPost.profilePic}
            username={currentPost.username}
            name={currentPost.name}
            postId={currentPost.postId}
            postTitle={currentPost.postTitle}
            post={currentPost.post}
            postDate={currentPost.postDate}
            postId={currentPost.postId}
            deletePost={deletePost} 
            />
            </div>
            );
        }

        console.log(addedPosts)
    return (
        <React.Fragment> 
        <div className="grid"> {prof} </div>
        <button variant="primary" onClick={() => setShowEdit(true)}>
            Edit profile
        </button>
        <EditProfile
            show={showEdit}
            onHide={() => setShowEdit(false)}
            userEdited={userEdited}
        />
        <div className="grid"> {addedPosts} </div>
        </React.Fragment>
    )
}


function EditProfile(props) {
    const [usersName, setUsersName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [userBio, setUserBio] = React.useState('');
    const [previewSource, setPreviewSource] = React.useState('');
    const [showEdit, setShowEdit] = React.useState(false)
    const { userEdited, onHide, ...rest } = props

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
            props.userEdited(editedProfile);
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
        console.log(userBio)
            fetch('/edit-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({usersName, username, userBio}), 
        }).then(response => {
            response.json().then(jsonResponse => {
            const {editedProfile} = jsonResponse;
            console.log(editedProfile)
            props.userEdited(editedProfile);
            });
        });
     }
    return (
        <React.Fragment> 
         <ReactBootstrap.Modal
            {...rest}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
      <ReactBootstrap.Modal.Header closeButton>
        <ReactBootstrap.Modal.Title id="contained-modal-title-vcenter">
          Edit Profile
        </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
        <div>
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
        <p> Username </p>
         <label htmlFor="usernameInput"></label>
        <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="usernameInput"
        ></input>
        <p> Bio </p>
         <label htmlFor="bioInput"></label>
        <input
            name="bio"
            type="text"
            value={userBio}
            onChange={(e) => setUserBio(e.target.value)}
            id="bioInput"
        ></input>
        </div>
      </ReactBootstrap.Modal.Body>
      <ReactBootstrap.Modal.Footer>
      <button onClick={() => {props.onHide; editUser()}}>save</button>
      </ReactBootstrap.Modal.Footer>
    </ReactBootstrap.Modal>
        </React.Fragment>
    );
}

/////////////////////////////////////////////////////////////////////////////// SEARCH ////////////////////////////////////////////////////

function SearchBar(props) {
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
     
     console.log(props.showResults)
     console.log(searchUser)
     console.log(searchPost)
     
    return (
        <div>
        <Search showSearchResults={props.showSearchResults} postSearch={postSearch} userSearch={userSearch} />
        <SearchResults showResults={props.showResults} checkPosts={checkPosts} checkProfile={checkProfile} seePosts={seePosts} seeProfile={seeProfile} searchPost={searchPost} searchUser={searchUser}/>
        </div>
    );
}
function Search(props) {
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
            props.showSearchResults();
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
    const [results, setResults] = React.useState()
    
    const showTheProfile = () => {
        setShowProfile(true); setResults(false) 
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
    const updateState = () => {
        setResults(props.showResults)
    }
    console.log(results)

    React.useEffect(() => {
    updateState()
    console.log('Hi')
    }, [props.showResults]);

    return (
        <div>
        {  results ?
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
    { showProfile ? <UserDetails showResults={props.showResults} userResult={userResult} checkPosts={props.checkPosts} checkProfile={props.checkProfile}  seePosts={props.seePosts} seeProfile={props.seeProfile} /> : null }
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
            <span> {props.bio} </span>
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

    const [isFollowing, setIsFollowing] = React.useState(true)

    function UserFollowing() {
        fetch('/user-following', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.userId,
        }).then(response => {
            response.json().then(jsonResponse => {
            const {everyoneFollowed} = jsonResponse;   
            // console.log(everyoneFollowed)
            userFollows(everyoneFollowed)
        });
    }); 
    }

    const userFollows = (everyoneFollowed) => {
        if (everyoneFollowed.length == 0) {
            setIsFollowing(false);
            console.log(isFollowing);
        }
    }

    React.useEffect(() => {
        UserFollowing()
    }, []);

    return (
        <div>
        <div className="user">
            <img className="resize"  src={props.profilePic}/>
            {props.name}
            {props.username}
            {props.bio}
            <FollowUser
            following={following}
            userId={props.userId}
            isFollowing={isFollowing}/>
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
    
    const UserDetail = () =>  {
        fetch('/user-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: props.userResult,
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
        <React.Fragment>
        { props.showResults ? 
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
        : null}
        </React.Fragment>
    );
    }

function FollowUser(props) {

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
    

    return (
        <button value={props.userId} onClick={followThem}>
        {props.isFollowing ? 'Following' : 'Follow'}
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
    const [added, setAdded] = React.useState([])

    React.useEffect(() =>{
        fetch('/home-posts')
            .then(response => response.json())
            .then(result => setPosts(result.allPosts));
    }, [added]);
    
    function addPost(postId, post, postTitle) {
    const newPost= {postId, post, postTitle}; 
    const currentPosts = [...posts]; 
    setAdded([...currentPosts, newPost]);
    }

    return (
        <div>
            <h2> Home </h2>
            <AddPosts addPost={addPost} />
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
        </div>
    );
}
function Logout() {

    return (
        <ReactBootstrap.Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title id="contained-modal-title-vcenter">
            Log out of Check?
            </ReactBootstrap.Modal.Title>
            </ReactBootstrap.Modal.Header>
            <ReactBootstrap.Modal.Body>
            <p> You can always log back in at any time. </p>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer>
            <button onClick={() => {props.onHide}}>Goodbye</button>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal>
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
    const [showCongrats, setShowCongrats] = React.useState(false);
    const showRewardForum = () => { setShowRewards(!showRewards) }

    function addTask(taskId, task, active) {
        const newTask= {taskId, task, active}; 
        const currentTasks = [...tasks]; 
        setTasks([...currentTasks, newTask]);
    }
    
    function endTask(taskId, task, active) {
        const currentEnded= {taskId, task, active}; 
        const allEnded = [...ended]; 
        setEndTask([...allEnded, currentEnded]);
    }
    
    React.useEffect(() =>{
        fetch('/tasks')
            .then(response => response.json())
            .then(result => setTasks(result.allTasks));
    }, [ended]);

    function completeTask(taskId, task, urgency, active) {
        const {doneTask}= {taskId, task, urgency, active};
        setTaskComplete([doneTask]);
        }

    React.useEffect(() => {
        fetch('/completed-tasks')
            .then(response => response.json())
            .then(result => setCompleted(result.completed));
        }, [taskComplete]);
    console.log(tasks)

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
    console.log(`tasks: `, tasks);
    return (
        <React.Fragment>
            <ReactBootstrap.Card style={{ width: '18rem'}}>
            <ReactBootstrap.Card.Header as="h5" className="font-weight-bold"> Checklist </ReactBootstrap.Card.Header>
            <ReactBootstrap.Card.Body> <AddTheTask addTask={addTask}/> </ReactBootstrap.Card.Body>
            <ReactBootstrap.ListGroup variant="flush"></ReactBootstrap.ListGroup>
            {tasks.map(result => {
                if (result.active == true) {
                    return (
                    <ReactBootstrap.ListGroup.Item key={result.taskId}> 
                        <TaskComplete
                        endTask={endTask}
                        amount={amount} 
                        taskId={result.taskId}
                        completeTask={completeTask}
                        completed={completed}
                        /> 
                        <Task
                        taskId={result.taskId}
                        task={result.task}
                        />
                        <TaskDelete
                        endTask={endTask} 
                        taskId={result.taskId}
                        />
            </ReactBootstrap.ListGroup.Item> 
            )}
            })}
            </ReactBootstrap.Card>
            <button className='button' onClick={showRewardForum}> Rewards </button>
            { showRewards ? <ListRewards editReward={editReward} rewardList={listRewards} changedAmount={changedAmount}/> : null}
        </React.Fragment>
    );
}

// REWARD ALERT

function Congratulations(props) {
    const [show, setShow] = React.useState(true);

    return (
      <React.Fragment> 
        { setShow ?
        <ReactBootstrap.Alert show={props.showCongrats} variant="success">
          <ReactBootstrap.Alert.Heading>Congratulations!</ReactBootstrap.Alert.Heading>
          <p>
            Your hard earned reward: {props.reward}
          </p>
          <div className="d-flex justify-content-end">
            <button onClick={() => setShow(false)} variant="outline-success">
              Enjoy!
            </button>
          </div>
        </ReactBootstrap.Alert>
        : null}
      </React.Fragment>
    );
}


// OUTLINE FOR MAIN OUTPUT OF THE TASK AND REWARD
function Task(props) {
    return (
        <span className="task">
            {props.task}
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
    function addNewTask() {
        fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({task}),
        }).then(response => {
            response.json().then(jsonResponse => {
            const {addedTask} = jsonResponse;
            const {taskId, task: taskText, active: activeBoolean} = addedTask;
            props.addTask(taskId, taskText, activeBoolean);
            setTask("")
        });
    });
    }

    return (
        <React.Fragment>
        <label htmlFor="taskInput"></label>
        <input
            value={task}
            placeholder="Add New Task"
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
    const [reward, setReward]  = React.useState('')
    const [target, setTarget] = React.useState('begin')
    const [showCongrats, setShowCongrats] = React.useState(false)
    
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

    console.log(props.amount)
    console.log(props.completed)

    function countCompleted() {    
        let amountSet = props.amount;
        let tasksCompleted = props.completed;
        if (tasksCompleted % amountSet === 0) {
            setTarget('received');
            setShowCongrats(true)
        }
    }


    return (
        <React.Fragment>
        <button value={props.taskId} onClick={() => {{deactivateTask()}; {countCompleted()}}}>Check</button>
        { showCongrats ? <Congratulations showCongrats={showCongrats} reward={reward} /> : null} 
        </React.Fragment>
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
        <button type="button" className="btn-close" aria-label="Close" value={props.taskId} onClick={deleteTask}></button>
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
            setAmount("")
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
            placeholder="New amount"
            onChange={(event) => setAmount(event.target.value)}
            id="amountInput"
        ></input>
        <button onClick={createAmount}> Save </button>
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
        <button value={props.rewardId} onClick={deleteReward} type="button" className="btn-close" aria-label="Close"></button>
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
        setReward("")
        });
    }); 
    }
    return (
    <div className="col-md-4">
       <h2> Rewards </h2>
            <p> Add to your list of rewards </p>
            <label htmlFor="rewardInput"></label>
            <input
                value={reward}
                placeholder="Enter Reward"
                onChange={(event) => setReward(event.target.value)}
                id="rewardInput"
            ></input>
            <button onClick={createReward}> Add </button>
            <h3> Current Rewards: </h3>
            <div className="grid">{props.rewardList}</div>
            <p> Do you wish to change the number of tasks you need to complete before receiving a reward? 
                <a onClick={changeAmount}> <u> Yes </u> </a> </p>
                { showAmount ? <AmountForum changedAmount={props.changedAmount} /> : null }
        </div>
        );
}

ReactDOM.render( <App/>, document.getElementById('sidebar'));