'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Search, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  User,
  Send,
  MoreVertical,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  type: 'email' | 'chat' | 'sms';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Alice Green (Tenant)',
    subject: 'Lease Renewal Question',
    preview: 'Hi, I received the notice about the rent increase for next year...',
    time: '10:30 AM',
    unread: true,
    type: 'email',
  },
  {
    id: '2',
    sender: 'John Smith (Owner)',
    subject: 'Tax Documents',
    preview: 'Can you please send me the annual statement for Oakwood?',
    time: 'Yesterday',
    unread: false,
    type: 'chat',
  },
  {
    id: '3',
    sender: 'Mike Fixit (Contractor)',
    subject: 'Work Order #1234',
    preview: 'I finished the repair at Unit 1A. Photo attached.',
    time: 'June 5',
    unread: false,
    type: 'sms',
  },
];

export default function CommunicationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(mockMessages[0].id);
  const selectedMessage = mockMessages.find(m => m.id === selectedId);

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communication Center</h1>
        <p className="text-muted-foreground">Manage all messages from tenants, owners, and contractors.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Inbox Sidebar */}
        <Card className="w-96 flex flex-col overflow-hidden">
          <CardHeader className="border-b p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1">All</Button>
              <Button size="sm" variant="ghost" className="flex-1">Unread</Button>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {mockMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors relative ${selectedId === msg.id ? 'bg-slate-100' : ''}`}
                  onClick={() => setSelectedId(msg.id)}
                >
                  {msg.unread && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />}
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold truncate max-w-[150px]">{msg.sender}</span>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <h4 className={`text-sm mb-1 truncate ${msg.unread ? 'font-bold' : 'font-medium'}`}>{msg.subject}</h4>
                  <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Message Content */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {selectedMessage ? (
            <>
              <CardHeader className="border-b p-4 flex flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">
                    {selectedMessage.sender[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base">{selectedMessage.sender}</CardTitle>
                    <CardDescription>{selectedMessage.subject}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon"><Phone className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Mock Thread */}
                  <div className="flex gap-4 max-w-[80%]">
                    <div className="size-8 bg-slate-100 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">AG</div>
                    <div className="bg-slate-100 p-4 rounded-lg rounded-tl-none">
                      <p className="text-sm">
                        {selectedMessage.preview}
                        {" I'm looking forward to staying another year but wanted to see if we could discuss the plumbing issue in the bathroom as well."}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">{selectedMessage.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs shrink-0 font-bold">ME</div>
                    <div className="bg-primary text-primary-foreground p-4 rounded-lg rounded-tr-none text-right">
                      <p className="text-sm">
                        Hi Alice, thanks for reaching out. We can definitely discuss both. I have a contractor scheduled to look at the plumbing on Wednesday.
                      </p>
                      <p className="text-[10px] opacity-70 mt-2">11:05 AM</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t space-y-4">
                <Textarea placeholder="Type your reply..." className="min-h-[100px]" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Add Internal Note</Button>
                    <Button variant="ghost" size="sm">Attach File</Button>
                  </div>
                  <Button className="px-8">
                    <Send className="mr-2 h-4 w-4" /> Send Reply
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center">
              <Mail className="h-16 w-16 mb-4 opacity-10" />
              <h3 className="text-lg font-semibold">Select a message</h3>
              <p>Choose a conversation from the left to start communicating.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
