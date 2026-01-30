import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Clock, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function CycleCard({ cycle, onClone, onViewDetails }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        {/* Author info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar>
            <AvatarImage src={cycle.authorAvatar} />
            <AvatarFallback>{cycle.authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{cycle.authorName}</p>
            <p className="text-sm text-muted-foreground">@{cycle.authorUsername}</p>
          </div>
        </div>
        
        {/* Cycle title */}
        <CardTitle>{cycle.name}</CardTitle>
        <CardDescription>{cycle.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Category badge */}
        <Badge>{cycle.category}</Badge>
        
        {/* Phase preview */}
        <div className="mt-4 space-y-1">
          {cycle.phases.slice(0, 3).map(phase => (
            <div key={phase.id} className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3" />
              <span>{phase.title} - {phase.duration}m</span>
            </div>
          ))}
          {cycle.phases.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{cycle.phases.length - 3} more phases
            </p>
          )}
        </div>
        
        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Copy className="h-4 w-4" />
            {cycle.clones} clones
          </span>
          <span>
            {formatDistanceToNow(cycle.publishedAt)} ago
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button onClick={() => onViewDetails(cycle.id)} variant="outline" className="flex-1">
          Preview
        </Button>
        <Button onClick={() => onClone(cycle.id)} className="flex-1">
          <Copy className="mr-2 h-4 w-4" />
          Clone
        </Button>
      </CardFooter>
    </Card>
  );
}