import { Plus, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onScheduleClick: () => void;
  interviewCount: number;
}

export function AdminHeader({ onScheduleClick, interviewCount }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Interview Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Schedule and manage candidate interviews efficiently
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-admin-card border border-admin-shadow">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium">{interviewCount}</span>
            <span className="text-muted-foreground">scheduled</span>
          </div>
        </div>
        
        <Button 
          onClick={onScheduleClick}
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-medium gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>
    </div>
  );
}