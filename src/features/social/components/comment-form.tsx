import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

interface CommentFormProps {
  cycleId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ cycleId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add comment
    console.log({ cycleId, comment });
    setComment("");
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <Button type="submit">Post Comment</Button>
    </form>
  );
}
