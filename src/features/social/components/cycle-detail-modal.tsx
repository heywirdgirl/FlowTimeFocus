import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";

export function CycleDetailModal({ cycleId, open, onOpenChange, onClone }) {
  const [cycle, setCycle] = useState(null);
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    if (open && cycleId) {
      // fetchCycleDetails(cycleId);
      // fetchComments(cycleId);
    }
  }, [open, cycleId]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cycle?.name}</DialogTitle>
          <DialogDescription>{cycle?.description}</DialogDescription>
        </DialogHeader>
        
        {/* Full phase list */}
        <div className="space-y-2">
          <h3 className="font-semibold">Phases</h3>
          {cycle?.phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center gap-4 p-3 border rounded">
              <span className="font-mono text-sm text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium">{phase.title}</p>
                <p className="text-sm text-muted-foreground">{phase.duration} minutes</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Comments section */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">Comments</h3>
          <CommentList comments={comments} />
          <CommentForm cycleId={cycleId} onCommentAdded={() => {}} />
        </div>
        
        <DialogFooter>
          <Button onClick={() => onClone(cycleId)} className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            Clone to My Cycles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
