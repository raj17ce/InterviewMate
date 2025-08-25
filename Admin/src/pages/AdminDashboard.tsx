import { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InterviewForm } from "@/components/admin/InterviewForm";
import { InterviewTable, Interview } from "@/components/admin/InterviewTable";
import { format, parseISO } from "date-fns";

// API base URL - use this for all API requests
const API_BASE_URL = "http://10.40.1.152:3000";

// Utility function to extract date and time from a timestamp string
const extractDateAndTime = (timestampStr: string | null | undefined) => {
  // Handle undefined or null values
  if (!timestampStr) {
    const now = new Date();
    return {
      date: now,
      formattedDate: format(now, "yyyy-MM-dd"),
      time: format(now, "HH:mm"),
      originalString: "undefined or null"
    };
  }
  
  // Handle ISO format strings (e.g., "2025-08-25T09:00:00.000Z")
  let timestamp: Date;
  
  try {
    if (timestampStr.includes('T') && timestampStr.includes('Z')) {
      // This is an ISO format string
      timestamp = parseISO(timestampStr);
    } else {
      // This is another format (e.g., "Fri Aug 22 2025 16:24:19 GMT+0530")
      timestamp = new Date(timestampStr);
    }
    
    // Check if the date is valid
    if (isNaN(timestamp.getTime())) {
      throw new Error("Invalid date");
    }
    
    return {
      date: timestamp,
      formattedDate: format(timestamp, "yyyy-MM-dd"),
      time: format(timestamp, "HH:mm"),
      originalString: timestampStr
    };
  } catch (error) {
    console.error("Error parsing date:", error, "Original string:", timestampStr);
    const now = new Date();
    return {
      date: now,
      formattedDate: format(now, "yyyy-MM-dd"),
      time: format(now, "HH:mm"),
      originalString: timestampStr
    };
  }
};

// Example usage for the ISO format
// const example = extractDateAndTime("2025-08-25T09:00:00.000Z");
// console.log(example);
// Output: { date: Date object, formattedDate: "2025-08-25", time: "09:00", originalString: "2025-08-25T09:00:00.000Z" }

export default function AdminDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  // Fetch all meetings from API
  const fetchMeetings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/interviews`);
      if (!res.ok) throw new Error("Failed to fetch meetings");
      const response = await res.json();
      
      // Handle the specific API response format: {success: true, message: string, data: Array, count: number}
      if (response && response.success && Array.isArray(response.data)) {
        // Convert date strings to Date objects and ensure all required fields exist
        setInterviews(response.data.map((item: any) => {
          // Extract date and time from interview_time
          const dateTime = item.interview_time 
            ? extractDateAndTime(item.interview_time)
            : { date: new Date(), time: "00:00" };
            
          return { 
            name: item.interviewee_name || "Unknown",
            role: item.role || "Not specified",
            technologies: item.technologies || [], // Keep as array if it exists
            date: dateTime.date,
            time: dateTime.time,
            meetingId: item.interview_id || `MTG-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
          };
        }));
      } else {
        console.error("Unexpected API response format:", response);
        setInterviews([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleScheduleInterview = async (formData: any) => {
    // Combine formData.date and formData.time into a single Date object
    let interviewDate: Date;
    
    if (formData.date instanceof Date) {
      // If formData.date is already a Date object
      // Parse time string (formData.time is in "HH:mm" format)
      const [hours, minutes] = formData.time.split(":").map(Number);
      
      // Create a new Date object from formData.date and set the time
      interviewDate = new Date(formData.date);
      interviewDate.setHours(hours, minutes, 0, 0);
    } else {
      // If date is a string, parse it
      interviewDate = new Date(formData.date + "T" + formData.time);
    }
    
    // Convert technologies string to array by splitting on commas and trimming whitespace
    const technologiesArray = formData.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0); // Remove empty items
    
    // Create the API payload with the correct format
    const apiPayload = {
      interviewee_name: formData.name,
      role: formData.role,
      technologies: technologiesArray, // Send as array
      interview_time: interviewDate.toISOString()
    };
    
    console.log("Sending to API:", apiPayload);
    
    // // For local state display, create an Interview object
    // const newInterview: any = {
    //   name: formData.name,
    //   role: formData.role,
    //   technologies: formData.technologies,
    //   interview_time: interviewDate,
    // };

    // // Update local state
    // setInterviews(prev => [newInterview, ...prev]);
    
    // Send data to backend API
    console.log(apiPayload);
    const res = await fetch(`${API_BASE_URL}/api/interviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiPayload)
    });

    if (!res.ok) {
      console.error("Failed to schedule interview");
      return;
    }

    // Refetch meetings to update the list
    fetchMeetings();
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
          onSuccess={fetchMeetings} // called after successful submit
        />
      </div>
    </div>
  );
}