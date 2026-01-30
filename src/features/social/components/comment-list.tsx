import type { Comment } from "../types";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-4">
          {/* User avatar can go here */}
          <div>
            <p className="font-semibold">{comment.username}</p>
            <p>{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
