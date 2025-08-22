import { format } from "date-fns";
import { Calendar, Clock, User, Briefcase, Code, Hash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Interview {
  id: string;
  name: string;
  role: string;
  technologies: string;
  date: Date;
  time: string;
  meetingId: string;
}

interface InterviewTableProps {
  interviews: Interview[];
}

export function InterviewTable({ interviews }: InterviewTableProps) {
  if (interviews.length === 0) {
    return (
      <Card className="bg-gradient-card border-admin-shadow shadow-soft">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No interviews scheduled</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Get started by scheduling your first interview using the button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-admin-shadow shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Scheduled Interviews
          <Badge variant="secondary" className="ml-auto">
            {interviews.length} {interviews.length === 1 ? 'interview' : 'interviews'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-admin-shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-bg hover:bg-admin-bg">
                <TableHead className="font-medium">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Meeting ID
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Role
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Technologies
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((interview) => (
                <TableRow key={interview.id} className="hover:bg-admin-bg/50 transition-colors">
                  <TableCell className="font-mono text-sm">
                    <Badge variant="outline" className="font-mono">
                      {interview.meetingId}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{interview.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{interview.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {interview.technologies.split(',').map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{format(interview.date, "PPP")}</TableCell>
                  <TableCell className="font-mono">{interview.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}