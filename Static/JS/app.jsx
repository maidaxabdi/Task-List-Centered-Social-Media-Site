
const App = () => {
    const [loggedOut, setLoggedOut] = React.useState(false); 
    const [loggedIn, setLoggedIn] = React.useState(false); 
    const [showLogin, setShowLogin] = React.useState(true);
    const [user, setUser] = React.useState('')

    const userRight = (userInfo) => {
        if (userInfo != null) {
            setLoggedIn(true)
            setShowLogin(false)
            setUser(userInfo)
        }
    }
    console.log(user)
    
    React.useEffect(() => {
        if (loggedOut == true) {
            setShowLogin(true)
            setLoggedIn(false)
            setShowLogout(false)
        }
    }, [loggedOut]);

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

    const [showLogout, setShowLogout] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);
    const [showHome, setShowHome] = React.useState(true);
    const [showResults, setShowResults] = React.useState(false);

    console.log(showResults)
    const showLogoutForum = () => { setShowLogout(true)}
    const showProfilePage= () => { setShowResults(false); setShowHome(false); setShowProfile(true); setShowLogout(false) }
    const showHomePage= () => { setShowResults(false); setShowHome(true); setShowProfile(false); setShowLogout(false)}

    const showSearchResults= () => { setShowResults(true); setShowHome(false); setShowProfile(false); setShowLogout(false)}

    return (
        <ReactBootstrap.Container>
        { showLogin ? 
        <ReactBootstrap.Row className="justify-content-xxl-center">
        <ReactBootstrap.Col xxl>
            <ReactBootstrap.Image src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png" /> 
        </ReactBootstrap.Col>
        <ReactBootstrap.Col xxl>
            <Login userRight={userRight} /> 
        </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        : null}
        { loggedIn ? 
        <ReactBootstrap.Row className="justify-content-xxl-center">
        <ReactBootstrap.Col xxl>
            <TaskList />
        </ReactBootstrap.Col>
        <ReactBootstrap.Col xxl>
        { showHome ? <Home path='/home'/> : null}
        { showProfile ? <UserProfile user={user} showResults={showResults} checkPosts={checkPosts} checkProfile={checkProfile}  seePosts={seePosts} seeProfile={seeProfile}  path='/profile' /> : null }
        { showLogout ? <Logout show={loggedIn} onHide={() => setLoggedOut(true)}/> : null }
        { showResults ? <SearchResults user={user} showResults={showResults} checkPosts={checkPosts} checkProfile={checkProfile} seePosts={seePosts} seeProfile={seeProfile} searchPost={searchPost} searchUser={searchUser}/> : null}
        </ReactBootstrap.Col>
        <ReactBootstrap.Col xxl>
        <div> <Search user={user} showSearchResults={showSearchResults} 
        postSearch={postSearch} userSearch={userSearch} /> 
        <div><button className='button' onClick={showHomePage}> Home </button></div>
        <div><button className='button' onClick={showProfilePage}> Profile </button></div>
        <div><button className='button' onClick={showLogoutForum}> Logout </button></div>
        </div>
        </ReactBootstrap.Col> 
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
            <div className='beginLogin'>
            <h1> <b> Happening now </b></h1>
            <h3> <b> Join Check today. </b> </h3> 
    
            <button className='newButton' variant="primary" onClick={() => setShowSignup(true)}>
            <b>Sign up with email</b>
            </button>
    
            <SignUp
            show={showSignup}
            onHide={() => setShowSignup(false)}
            />
            
            <h5> <b> Already have an account?  </b> </h5>
            <button className='signInButton' variant="primary" onClick={() => setShowSignin(true)}>
            <b>Sign in</b>
            </button>
    
            <SignIn
            show={showSignin}
            onHide={() => setShowSignin(false)}
            userRight={props.userRight}
            />
            </div>
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
              <b> Create your account </b>
            </ReactBootstrap.Modal.Title>
            </ReactBootstrap.Modal.Header>
            <ReactBootstrap.Modal.Body>
            <label>
            <input
                className='user'
                value={email}
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                id="emailInput"
            ></input>
            </label>
            <label>
              <input
                className='user'
                value={username}
                placeholder="Username"
                onChange={(event) => setUsername(event.target.value)}
                id="usernameInput"
            ></input>
            </label>
            <label>
              <input
                className='user'
                type='password'
                value={password}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                id="passwordInput"
            ></input>
            </label>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer>
            <button className='change' onClick={() => {props.onHide; AddNewUser()}}>Sign up</button>
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
                const {user} = jsonResponse;
                const {userId: userIdText} = user;
                props.userRight(userIdText)
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
          <b>Sign in to Check</b>
        </ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
        <form>
            <label>
            <input
                value={email}
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                id="emailInput"
            ></input>
            </label>
            <label>
              <input
                value={password}
                type='password'
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                id="passwordInput"
            ></input>
            </label>
        </form>
      </ReactBootstrap.Modal.Body>
      <ReactBootstrap.Modal.Footer>
        <button className='change' onClick={() => {props.onHide; loginUser()}}>Sign in</button>
      </ReactBootstrap.Modal.Footer>
    </ReactBootstrap.Modal>
    );
    }


///////////////////////////////////////////// PROFILE //////////////////////////////////////////////////////////////////////////////////////////

// OUTLINE OF POST
function Post(props) {

    return (
        <ReactBootstrap.Card className='postUserTaskReward' style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Body>
        <ReactBootstrap.Card.Title> <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/> <b>{props.name}</b>  <span className="mb-2 text-muted" > @{props.username} </span> </ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Title> <b>{props.postTitle}</b></ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Text>
        <span className="text-md-left"> {props.post} </span>
        </ReactBootstrap.Card.Text>
        <ReactBootstrap.Card.Img className="postPicture" src={props.picture}/> 
        <ReactBootstrap.Card.Text>
        <span className="text-sm-left" className="mb-2 text-muted"  > {props.postDate} </span>
        </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
    );
}

// OUTLINE OF USER POST
function UserPost(props) {

    return (
        <ReactBootstrap.Card style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Body>
        <ReactBootstrap.Card.Title> <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/> <b>{props.name}</b>  <span className="mb-2 text-muted" > @{props.username} </span> </ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Title> <b>{props.postTitle}</b></ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Text>
        <span className="text-md-left"> {props.post} </span>
        </ReactBootstrap.Card.Text>
        <ReactBootstrap.Card.Img className="postPicture" src={props.picture}/> 
        <ReactBootstrap.Card.Text>
        <span className="mb-2 text-muted"> {props.postDate} </span>
        <PostDelete postId={props.postId}
        deletePost={props.deletePost} />
        </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
    );
}

// CREATE A NEW POST
function AddPosts(props) {
    const [post, setPost] = React.useState("")
    const [postTitle, setPostTitle] = React.useState("")
    const [picture, setPicture] = React.useState(null)
    const [previewSource, setPreviewSource] = React.useState('');

    function createPost() {
        formData.append('postTitle', postTitle)
        formData.append('post', post)
        formData.append('my-file', picture)
        fetch('/new-post', {
            method: 'POST',
            body: formData,
        }).then(response => {
            response.json().then(jsonResponse => {
            const {createdPost} = jsonResponse;
            const {postId, post: postText, postTitle: postTitleText, profilePic: profilePicIMG, username: usernameText, name: nameText, picture: pictureImg} = createdPost;
            props.addPost(postId, postText, postTitleText, profilePicIMG, usernameText, nameText, pictureImg)
            setPost("")
            setPostTitle("")
            setPreviewSource('')
            });
        });
  }

    const formData = new FormData();
    const reader = new FileReader()
    
    const whenPicChanges = (e) => {
        setPicture(e.target.files[0]);
        const file = e.target.files[0];
        console.log(file)
        previewFile(file);
    }

    const previewFile = file => {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setPreviewSource(reader.result)
        }
    }

    return (
        
        <ReactBootstrap.Card style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Body>
        <input
            className="form-control form-control-lg" 
            value={postTitle}
            placeholder="Post Title"
            onChange={(event) => setPostTitle(event.target.value)}
            id="postTitleInput"
        ></input>
       <textarea
            className="form-control form-control-lg" 
            value={post}
            placeholder="What's happening?"
            onChange={(event) => setPost(event.target.value)}
            id="postInput"
        ></textarea>
        <div className='image-upload'>
        <label for="file-input">
        <img className='imageUpload' src="https://res.cloudinary.com/check/image/upload/v1638756544/3007260_pg76d8.png" style={{"pointerEvents": "none"}} />
        </label>
        <input
            id='file-input'
            type="file"
            accept="image/*"
            name="my-file"
            onChange={(e) => whenPicChanges(e)}
            ></input>
        </div>
            {previewSource && (
            <img src={previewSource} alt="chosen" style={{height: '100px'}}/>
            )}
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
function UserProfile(props) {
    const [show, setShow] = React.useState(true);
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

    const [userResult, setUserResult] = React.useState('');
    const [showResults, setShowResults] = React.useState(false)

    const switchUserProfile = (sent) => {
        setShow(false)
        setUserResult(sent)
        console.log(sent)
        setShowResults(true)
    }

    const prof = (
        <div key={userInfo.userId}>
            <User
                name={userInfo.name}
                username={userInfo.username}
                profilePic={userInfo.profilePic}
                bio={userInfo.bio}
                userId={userInfo.userId}
                user={props.user}
                switchUserProfile={switchUserProfile}
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
            picture={currentPost.picture}
            postId={currentPost.postId}
            deletePost={deletePost} 
            />
            </div>
            );
        }

        console.log(addedPosts)

    return (
        <React.Fragment> 
        { show ?
        <div>
        <div className="grid"> {prof} </div>
        <button className='edit' variant="primary" onClick={() => setShowEdit(!showEdit)}>
            Edit profile
        </button>
        { showEdit ? <EditProfile
            show={showEdit}
            userEdited={userEdited}
        /> : null}
        <div className="grid"> {addedPosts} </div>
        </div>
        : <UserDetails user={props.user} showResults={showResults} userResult={userResult} checkPosts={props.checkPosts} checkProfile={props.checkProfile}  seePosts={props.seePosts} seeProfile={props.seeProfile} /> }
        </React.Fragment>
    )
}


function EditProfile(props) {
    const [usersName, setUsersName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [userBio, setUserBio] = React.useState('');
    const [previewSource, setPreviewSource] = React.useState('');
    const [show, setShow] = React.useState(true)

    const { userEdited, onHide, ...rest } = props

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
        { show ?
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
        <div className='image-upload'>
        <label for="file-input">
        <img className='imageUpload' src="https://res.cloudinary.com/check/image/upload/v1638756544/3007260_pg76d8.png" style={{"pointerEvents": "none"}} />
        </label>
        <input
            id='file-input'
            type="file"
            accept="image/*"
            name="my-file"
            onChange={(e) => whenPicChanges(e)}
        ></input>
        </div>
        {previewSource && (
            <img src={previewSource} alt="chosen" style={{height: '75px'}}/>
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
        <textarea
            className="form-control form-control-lg" 
            name="bio"
            type="text"
            value={userBio}
            onChange={(e) => setUserBio(e.target.value)}
            id="bioInput"
        ></textarea>
        </div>
      </ReactBootstrap.Modal.Body>
      <ReactBootstrap.Modal.Footer>
      <button className='change' onClick={() => {setShow(false); editUser()}}>save</button>
      </ReactBootstrap.Modal.Footer>
    </ReactBootstrap.Modal>
    :  null }
        </React.Fragment>
    );
}

/////////////////////////////////////////////////////////////////////////////// SEARCH ////////////////////////////////////////////////////

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
            setSearch('')
        });
    });
    }

    return (
        <React.Fragment>
        <input
            className="searchInput"
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
                                bio={result.bio}
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
                            picture={result.picture}
                            />
                            </div>
                            );
                            })}
                        </div></div>
                    : null}
    { showProfile ? <UserDetails user={props.user} showResults={props.showResults} userResult={userResult} checkPosts={props.checkPosts} checkProfile={props.checkProfile}  seePosts={props.seePosts} seeProfile={props.seeProfile} /> : null }
    </div>
    );
}

///////////////////////////////////////////////////////// OTHER USERS ////////////////////////////////////////////////////////////
function UserHeader (props) {
    return (
       <ReactBootstrap.Card className='postUserTaskReward' style={{ width: '40rem' }}>
        <ReactBootstrap.Card.Body> 
        <ReactBootstrap.Card.Title> <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/> <b>{props.name}</b>  <span className="mb-2 text-muted" > @{props.username} </span> </ReactBootstrap.Card.Title>
        <ReactBootstrap.Card.Text> <span> {props.bio} </span>  </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
      </ReactBootstrap.Card>
    );
}

function UserProfileHeader (props) {

    if (props.notCurrentUser) {
    return (
       <ReactBootstrap.Card style={{ width: '40rem' }}>
        {/* <ReactBootstrap.Card.Img variant="top" src="holder.js/100px180" /> */}
        <ReactBootstrap.Card.Body> 
        <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/>
        <ReactBootstrap.Card.Title> <b> {props.name} </b> </ReactBootstrap.Card.Title> 
        <span className="font-weight-light" > @{props.username} </span> 
        <ReactBootstrap.Card.Text> 
            <FollowUser
                notCurrentUser={props.notCurrentUser}
                following={props.following}
                userId={props.userId}
                isFollowing={props.isFollowing}
                user={props.user}
                unfollowed={props.unfollowed}
                userFollowing={props.userFollowing}/>
            </ReactBootstrap.Card.Text> 
            <ReactBootstrap.Card.Text> {props.bio} </ReactBootstrap.Card.Text> 
            <ReactBootstrap.Card.Text> 
            <RetrieveFollowed 
            checkPosts={props.checkPosts} 
            checkProfile={props.checkProfile} 
            seePosts={props.seePosts} 
            seeProfile={props.seeProfile}
            userId={props.userId}
            allFollowing={props.allFollowing}
            followed={props.followed}
            user={props.user}
            switchUserProfile={props.switchUserProfile}
            newUser={props.newUser}
           />
            </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
      </ReactBootstrap.Card>
    );
    }
    else {
        return (
        <ReactBootstrap.Card style={{ width: '40rem' }}>
        {/* <ReactBootstrap.Card.Img variant="top" src="holder.js/100px180" /> */}
        <ReactBootstrap.Card.Body> 
        <ReactBootstrap.Card.Img className="resize" src={props.profilePic}/> 
        <ReactBootstrap.Card.Title> <b> {props.name} </b> </ReactBootstrap.Card.Title> 
        <ReactBootstrap.Card.Text>
            <span className="font-weight-light" > @{props.username} </span> 
            </ReactBootstrap.Card.Text> 
            <ReactBootstrap.Card.Text> {props.bio} </ReactBootstrap.Card.Text> 
            <ReactBootstrap.Card.Text> 
            <RetrieveFollowed 
            checkPosts={props.checkPosts} 
            checkProfile={props.checkProfile} 
            seePosts={props.seePosts} 
            seeProfile={props.seeProfile}
            userId={props.userId}
            allFollowing={props.allFollowing}
            followed={props.followed}
            user={props.user}
            switchUserProfile={props.switchUserProfile}
            newUser={props.newUser}
            />
            </ReactBootstrap.Card.Text>
        </ReactBootstrap.Card.Body>
      </ReactBootstrap.Card>
        )
    }
}

function User(props) {
    const [added, setAdded] = React.useState([])
    const [followed, setFollowed] = React.useState([])
    const [showProfile, setShowProfile] = React.useState(false)
    const [notCurrentUser, setNotCurrentUser] = React.useState(true)

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
  
    React.useEffect(() => {
        if (props.user == props.userId) {
            setNotCurrentUser(false)
            console.log(props.user)
            console.log(props.userId)
        }
    }, []);

    const [isFollowing, setIsFollowing] = React.useState(false)
    const [userFollowing, setUserFollowing] = React.useState([])

    const following = (userFollowed) => {
        setIsFollowing(true);
        setAdded(userFollowed)
    }
  
    return (
        <div>
        <div className="user">
            <UserProfileHeader
            profilePic={props.profilePic}
            name={props.name}
            username={props.username}
            bio={props.bio}
            checkPosts={checkPosts}
            checkProfile={checkProfile}
            seePosts={seePosts}
            seeProfile={seeProfile}
            userId={props.userId}
            allFollowing={allFollowing}
            followed={followed}
            notCurrentUser={notCurrentUser}
            userId={props.userId}
            user={props.user}
            switchUserProfile={props.switchUserProfile}
            newUser={props.newUser}
            following={following}
            userFollowing={userFollowing}
            />
        </div>
        </div>
    );
 }
  
 function UserDetails(props) {
    const isMountRef = React.useRef(false);
    const [showResults, setShowResults] = React.useState(props.showResults);
    const [showNewResults, setShowNewResults] = React.useState(false);
  
    const newUser = (sent) => {
        if (sent == true) {
            UserDetail()
            setShowResults(false)
        }
    }
    const [thePosts, setThePosts] = React.useState([])
    const [theProfile, setTheProfile] = React.useState([])

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
                setThePosts(Profile[1]);
                setTheProfile(Profile[0]);
            });
            });
    }

 
    React.useEffect(() => {
        isMountRef.current = true}, []);
  
    React.useEffect(() => {
        if (isMountRef && theProfile && thePosts) {
            console.log('here')
            UserDetail()
        }}, []);
  
    console.log(thePosts)
    console.log(theProfile)
    return (
        <React.Fragment>
        { showResults ?
            <span>
        {theProfile.map(result => {
            return (
            <span key={result.userId}>
                <User
                username={result.username}
                userId={result.userId}
                profilePic={result.profilePic}
                name={result.name}
                user={props.user}
                bio={result.bio}
                newUser={newUser}
                />
            </span>
            )
            })}
        {thePosts.map(result => {
            return (
            <span key={result.postId}>
                 <Post
                name={result.name}
                profilePic={result.profilePic}
                username={result.username}
                postTitle={result.postTitle}
                post={result.post}
                postDate={result.postDate}
                picture={result.picture}
                />
            </span>
            )
            })}
        </span>
        :
            <span>
        {theProfile.map(result => {
            return (
            <span key={result.userId}>
                <User
                username={result.username}
                userId={result.userId}
                profilePic={result.profilePic}
                name={result.name}
                user={props.user}
                newUser={newUser}
                bio={result.bio}
                />
            </span>
            )
            })}
        {thePosts.map(result => {
            return (
            <span key={result.postId}>
                 <Post
                name={result.name}
                profilePic={result.profilePic}
                username={result.username}
                postTitle={result.postTitle}
                post={result.post}
                postDate={result.postDate}
                picture={result.picture}
                />
            </span>
            )
            })}
        </span> }
        </React.Fragment>
    );
    }
  
 function FollowUser(props) {
    const [following, setFollowing] = React.useState(false)

    React.useEffect(() => {
        isFollowing()
    },  []);

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
            const {follows: followsText} = userFollowed[0];
            console.log(userFollowed)
            setFollow(followsText)
        });
    });
    }
    
    function Unfollow() {
        fetch('/user-unfollowed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.userId,
        }).then(response => {
            response.json().then(jsonResponse => {
            const {personUnfollowed} = jsonResponse;  
            const {follows: followsText} = personUnfollowed[0];
            setFollow(followsText)
        });
    });
    }

    const handleClick = () => {
        if (following) {
            Unfollow()
        }
        else {
            followThem()
        }
    }

    function isFollowing() {
        fetch('/user-following', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: props.userId,
        }).then(response => {
            response.json().then(jsonResponse => {
            console.log(jsonResponse)
            const {personFollowed} = jsonResponse;  
            const {follows: followsText} = personFollowed[0];
            console.log(personFollowed)
            setFollow(followsText)
        });
    });
    }

    const setFollow = (followsText) => {
        console.log('***************************')
        console.log(followsText)
        setFollowing(followsText)
        console.log(following)
    }

    console.log(following)
    return (
        <button className='profile' value={props.userId} onClick={handleClick}>
        {following ? 'Following' : 'Follow'}
        </button>
    );
 }
  
  
 function RetrieveFollowed(props) {
    const isMountRef = React.useRef(false);
    const [userResult, setUserResult] = React.useState('')
  
    const [showProfile, setShowProfile] = React.useState(false)
    const [showResults, setShowResults] = React.useState(false)
  
   React.useEffect(() => {
    Following();
    }, []);
  
    const [count, setCount] = React.useState('')
    const setTheCount = (count) => {
        let unmounted = false;
        if (!unmounted) {
        setCount(count)
        }
        return () => { unmounted = true}
    }
  
    const showTheProfile = (userId) => {
         setShowResults(false);
         if (props.switchUserProfile) {
         props.switchUserProfile(userId);
         }
         else {
             setShowProfile(true)
             props.newUser(true)
         }
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
            props.allFollowing(everyoneFollowed[0])
            const {count: countText} = everyoneFollowed[1]
            setTheCount(countText)
        });
    });
    }
    // React.useEffect(() => {
    //     isMountRef.current = true;
    //     }, []);
  
    // React.useEffect(() => {
    //     if (isMountRef) {
    //         showTheResults()
    //     }}, []);
  
        console.log(showProfile)
        console.log(showResults)
       
    return (
        <React.Fragment>
        <span className='followers' onClick={() => {showTheResults(); {Following()}}}> {count} Following </span>
        { showResults ?
        <span>
        {props.followed.map(result => {
            return (
            <span key={result.userId} onClick={() => {
                showTheProfile(result.userId);
                setUserResult(result.userId)
                setShowResults(false);
                }}>
                <UserHeader
                username={result.username}
                profilePic={result.profilePic}
                name={result.name}
                bio={result.bio}
                />
            </span>
            )
            })}
        </span>
        : null }
        { showProfile ? <UserDetails user={props.user} showResults={props.showResults} userResult={userResult} checkPosts={props.checkPosts} checkProfile={props.checkProfile}  seePosts={props.seePosts} seeProfile={props.seeProfile} /> : null}
        </React.Fragment>
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
            <ReactBootstrap.Card>
            <ReactBootstrap.Card.Body><h4> <b>Home </b> </h4></ReactBootstrap.Card.Body>
            </ReactBootstrap.Card>
            <AddPosts addPost={addPost} />
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
                    picture={result.picture}
                />
            </div>
            )
            })}
        </div>
    );
}
function Logout(props) {

    return (
        <ReactBootstrap.Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title id="contained-modal-title-vcenter">
            <b> Log out of Check? </b>
            </ReactBootstrap.Modal.Title>
            </ReactBootstrap.Modal.Header>
            <ReactBootstrap.Modal.Body>
            <p> You can always log back in at any time. </p>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer>
            <button  className='change' onClick={props.onHide}>Goodbye</button>
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
    const [reward, setReward] = React.useState('')
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
    
    const startShowCongrats = (sent) => {
        setReward(sent);
        setShowCongrats(true);
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
            editReward={editReward} 
            rewardId={currentReward.rewardId}
            />
            </div>
            );
    
    }

    console.log(showCongrats)
    console.log(reward)
    console.log(`tasks: `, tasks);
    return (
        <React.Fragment>
            <ReactBootstrap.Card style={{ width: '18rem'}}>
            <ReactBootstrap.Card.Header as="h5"> <b>Checklist </b></ReactBootstrap.Card.Header>
            <ReactBootstrap.Card.Body> <AddTheTask addTask={addTask}/> </ReactBootstrap.Card.Body>
            <ReactBootstrap.ListGroup variant="flush"></ReactBootstrap.ListGroup>
            {tasks.map(result => {
                if (result.active == true) {
                    return (
                    <ReactBootstrap.ListGroup.Item className='postUserTaskReward' key={result.taskId}> 
                        <TaskComplete
                        endTask={endTask}
                        amount={amount} 
                        taskId={result.taskId}
                        completeTask={completeTask}
                        completed={completed}
                        startShowCongrats={startShowCongrats}
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
            <button className='button' onClick={showRewardForum}>  Rewards </button>
            { showCongrats ? <Congratulations onHide={() => setShowCongrats(false)} reward={reward} /> : null} 
            { showRewards ? <ListRewards editReward={editReward} rewardList={listRewards} changedAmount={changedAmount}/> : null}
        </React.Fragment>
    );
}

// REWARD ALERT

function Congratulations(props) {
    const [show, setShow] = React.useState(true);
    console.log('hello')
    return (
      <React.Fragment> 
        { setShow ?
        <ReactBootstrap.Alert show={props.showCongrats} variant="success">
          <ReactBootstrap.Alert.Heading>Congratulations!</ReactBootstrap.Alert.Heading>
            <div> Your hard earned reward: {props.reward}
          <button className='update' onClick={props.onHide} variant="outline-success">
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
       <ReactBootstrap.Card  className='postUserTaskReward'>
        <ReactBootstrap.Card.Body> {props.reward} <RewardDelete editReward={props.editReward} 
            rewardId={props.rewardId}/> </ReactBootstrap.Card.Body>
      </ReactBootstrap.Card>
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
            className='taskReward'
            value={task}
            placeholder="Add New Task"
            onChange={(event) => setTask(event.target.value)}
            id="taskInput"
        ></input>
        <button className="save" onClick={addNewTask}> Add </button>
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
    }, []);

    console.log(props.amount)
    console.log(props.completed)

    function countCompleted() {    
        let amountSet = props.amount;
        let tasksCompleted = props.completed;
        if (tasksCompleted % amountSet === 0) {
            setTarget('received');
            setShowCongrats(true)
            props.startShowCongrats(reward)
        }
    }


    return (
        <React.Fragment>
        {/* <button value={props.taskId} onClick={() => {{deactivateTask()}; {countCompleted()}}}>Check</button> */}
        <img className="checkMark" src="https://res.cloudinary.com/check/image/upload/v1638664458/kissclipart-blue-checkbox-icon-clipart-checkbox-computer-icons-7c29153c909a542f_prbhzl.png" value={props.taskId} onClick={() => {{deactivateTask()}; {countCompleted()}}}/>
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
        <button className="save" onClick={createAmount}> Save </button>
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
        <React.Fragment>
        <ReactBootstrap.Card >
        <ReactBootstrap.Card.Body>
          <ReactBootstrap.Card.Title> <b>Rewards </b></ReactBootstrap.Card.Title>
          <ReactBootstrap.Card.Text>
          <p> Add to your list of rewards </p>
                  <label htmlFor="rewardInput"></label>
                  <input
                      className='taskReward'
                      value={reward}
                      placeholder="Enter Reward"
                      onChange={(event) => setReward(event.target.value)}
                      id="rewardInput"
                  ></input>
                  <button className="save" onClick={createReward}> Add </button>
          </ReactBootstrap.Card.Text>

        <ReactBootstrap.Card.Title> <b>Current Rewards </b></ReactBootstrap.Card.Title>
        {props.rewardList}
        <p> Do you wish to change the number of tasks you need to complete before receiving a reward? 
              <span className='amountChange'onClick={changeAmount}> <b> Yes </b> </span> </p>
              { showAmount ? <AmountForum changedAmount={props.changedAmount} /> : null }
        </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
        </React.Fragment>
        );
}

ReactDOM.render( <App/>, document.getElementById('sidebar'));