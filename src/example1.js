var CommentList = React.createClass({
    render: function () {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});
var CommentForm = React.createClass({
    getInitialState: function(){
        return {author: '', text:''}
    },
    handleAuthorChange: function(e){
        this.setState({author: e.target.value})
    },
    handleTextChange: function(e){
        this.setState({text: e.target.value})
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author){
            return;
        }
        this.props.onCommentSubmit({author:author, text:text});
        this.setState({author:'',text:''});
    },
    render: function () {
        var divstyle = {
            display: 'block'
        };
        return (
            <form className="commentForm" style={divstyle} onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" style={{display:'block'}} value={this.state.author} onChange={this.handleAuthorChange}/>
                <input type="text" placeholder="Say something" style={{display:'block'}} value={this.state.text} onChange={this.handleTextChange}/>
                <input type="submit" value="Post"/>
            </form>
        )
    }
});
var CommentBox = React.createClass({
    loadCommentFromServer: function() {
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data})
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment){
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            type: 'POST',
            data: comment,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })

    },
    getInitialState: function(){
      return {data: []};
    },
    componentDidMount: function(){
        this.loadCommentFromServer();
        setInterval(this.loadCommentFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
               </div>
        );
    }
});
var Comment = React.createClass({
    rawMarkup: function(){
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return {__html:rawMarkup}

    },
    render: function(){
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

// tutorial8.js
var data = [
    {id: 1, author: "Pete Hunt", text: "This is one comment"},
    {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

ReactDOM.render(
    <CommentBox url="api/comment/comment.json" poolInterval = {2000}/>,
    document.getElementById('content')
);