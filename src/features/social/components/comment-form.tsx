import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";

export function CommentForm({ cycleId, onCommentAdded }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: add comment
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea 
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" className="mt-2">Post Comment</Button>
    </form>
  );
}