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
            <h4> {props.postTitle} </h4>
                {props.post} 
        </span>
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
            const {postId, post: postText, postTitle: postTitleText} = createdPost;
            props.addPost(postId, postText, postTitleText)
            });
        });
  }
    return (
        <React.Fragment>
        <h3> Create a New Post </h3>
        <label htmlFor="postTitleInput"></label>
        <p> Post Title </p>
        <input
            value={postTitle}
            onChange={(event) => setPostTitle(event.target.value)}
            id="postTitleInput"
        ></input>
        <p> Post </p>
        <label htmlFor="postInput"></label>
        <input
            value={post}
            onChange={(event) => setPost(event.target.value)}
            id="postInput"
        ></input>
        
        <button onClick={createPost}> Post </button>
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
function Home() {
    const [showProfile, setShowProfile] = React.useState(false);
    const showProfileFeed = () => { setShowProfile(true) }

    const [posts, setPosts] = React.useState([]);
    const [deletedPost, setDeletedPost] = React.useState([]);

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
        <button onClick={showProfileFeed}> Profile </button>
         {showProfile ? <Profile addPost={addPost} addedPosts={addedPosts}/> : null } 
        </React.Fragment>
    )
}

// USERS PROFILE PAGE 
function Profile(props) {
    
    
    return (
        <React.Fragment>
        <h2> Show logged in user profile picture, name, username, and edit option to change any of those (maybe bio too?) </h2>
        <p> logged in user FOLLOWERS and FOLLOWING count and if you click on it you can see pictures/bios/usernames of other users. 
            Can click on those and redirect to those users profile page </p>
        <p> List of users posts and if you click a button can see all of users liked posts  </p>
        <h2> Posts </h2>
        <AddPosts addPost={props.addPost}/>
        <div className="grid"> {props.addedPosts} </div>
        </React.Fragment>
    )
}




ReactDOM.render(<Home />, document.getElementById('home'));