import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Briefcase, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://10.40.1.152:3000";

const interviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  technologies: z.string().min(2, "Technologies are required"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Time is required"),
});

type InterviewFormData = z.infer<typeof interviewSchema>;

interface InterviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // called after successful POST
}

export function InterviewForm({ open, onOpenChange, onSuccess }: InterviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
  });

  const handleSubmit = async (data: InterviewFormData) => {
    setIsSubmitting(true);
    let interviewDate: Date;
    
    if (data.date instanceof Date) {
      // If formData.date is already a Date object
      // Parse time string (formData.time is in "HH:mm" format)
      const [hours, minutes] = data.time.split(":").map(Number);
      
      // Create a new Date object from data.date and set the time
      interviewDate = new Date(data.date);
      interviewDate.setHours(hours, minutes, 0, 0);
    } else {
      // If date is a string, parse it
      interviewDate = new Date(data.date + "T" + data.time);
    }
    
    // Convert technologies string to array by splitting on commas and trimming whitespace
    const technologiesArray = data.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0); // Remove empty items
    
    // Create the API payload with the correct format
    const apiPayload = {
      interviewee_name: data.name,
      role: data.role,
      technologies: technologiesArray, // Send as array
      interview_time: interviewDate.toISOString()
    };
    
    console.log("Sending to API:", apiPayload);
    try {
      const res = await fetch(`${API_BASE_URL}/api/interviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      if (!res.ok) throw new Error("Failed to schedule interview");
      form.reset();
      onOpenChange(false);
      toast({
        title: "Interview Scheduled!",
        description: "The interview has been successfully scheduled.",
      });
      onSuccess(); // refresh meetings
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-card border-admin-shadow">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Schedule Interview
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Candidate Name
            </Label>
            <Input
              id="name"
              placeholder="Enter candidate name"
              {...form.register("name")}
              className="h-11 bg-admin-bg border-border focus:border-primary transition-colors"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Role
            </Label>
            <Input
              id="role"
              placeholder="e.g., Frontend Developer, Backend Engineer"
              {...form.register("role")}
              className="h-11 bg-admin-bg border-border focus:border-primary transition-colors"
            />
            {form.formState.errors.role && (
              <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies" className="text-sm font-medium flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              Technologies
            </Label>
            <Input
              id="technologies"
              placeholder="e.g., React, Node.js, Python, AWS"
              {...form.register("technologies")}
              className="h-11 bg-admin-bg border-border focus:border-primary transition-colors"
            />
            {form.formState.errors.technologies && (
              <p className="text-sm text-destructive">{form.formState.errors.technologies.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal bg-admin-bg border-border hover:border-primary transition-colors",
                      !form.watch("date") && "text-muted-foreground"
                    )}
                  >
                    {form.watch("date") ? (
                      format(form.watch("date"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("date")}
                    onSelect={(date) => form.setValue("date", date!)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                {...form.register("time")}
                className="h-11 bg-admin-bg border-border focus:border-primary transition-colors"
              />
              {form.formState.errors.time && (
                <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 border-border hover:bg-muted transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-gradient-primary hover:opacity-90 transition-opacity shadow-medium"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}