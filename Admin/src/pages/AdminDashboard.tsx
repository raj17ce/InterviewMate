import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InterviewForm } from "@/components/admin/InterviewForm";
import { InterviewTable, Interview } from "@/components/admin/InterviewTable";

export default function AdminDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([
    // Sample data - in real app this would come from your API
    {
      id: "1",
      name: "John Doe",
      role: "Frontend Developer",
      technologies: "React, TypeScript, Tailwind",
      date: new Date("2024-01-15"),
      time: "10:00",
      meetingId: "MTG-001"
    },
    {
      id: "2", 
      name: "Jane Smith",
      role: "Backend Engineer",
      technologies: "Node.js, PostgreSQL, AWS",
      date: new Date("2024-01-16"),
      time: "14:30",
      meetingId: "MTG-002"
    }
  ]);

  const handleScheduleInterview = (formData: any) => {
    const newInterview: Interview = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role,
      technologies: formData.technologies,
      date: formData.date,
      time: formData.time,
      meetingId: `MTG-${String(interviews.length + 1).padStart(3, '0')}`
    };

    setInterviews(prev => [newInterview, ...prev]);
    
    // Here you would typically send the data to your backend API
    console.log("Sending to API:", newInterview);
  };

  return (
    <div className="min-h-screen bg-admin-bg">
      <div className="container mx-auto px-4 py-8">
        <AdminHeader 
          onScheduleClick={() => setIsFormOpen(true)}
          interviewCount={interviews.length}
        />
        
        <InterviewTable interviews={interviews} />
        
        <InterviewForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleScheduleInterview}
        />
      </div>
    </div>
  );
}