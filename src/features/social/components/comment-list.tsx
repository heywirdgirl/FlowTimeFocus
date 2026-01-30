export function CommentList({ comments }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-4">
          <div className="flex-1">
            <p className="font-semibold">{comment.username}</p>
            <p className="text-sm text-muted-foreground">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}