"use client"

import { useEffect, useState } from "react"
import { api, GroupResponse } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, UserPlus } from "lucide-react"

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDesc, setNewGroupDesc] = useState("")

  const [inviteEmail, setInviteEmail] = useState("")
  const [activeInviteGroupId, setActiveInviteGroupId] = useState<string | null>(null)
  
  const [activeMembersGroupId, setActiveMembersGroupId] = useState<string | null>(null)
  const [groupMembers, setGroupMembers] = useState<any[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const data = await api.groups.list()
      setGroups(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName) return
    try {
      await api.groups.create(newGroupName, newGroupDesc)
      setIsCreateOpen(false)
      setNewGroupName("")
      setNewGroupDesc("")
      fetchGroups()
    } catch (err: any) {
      console.error(err)
      alert("Failed to create group: " + (err.message || String(err)))
    }
  }

  const handleInvite = async (groupId: string) => {
    if (!inviteEmail) return
    try {
      await api.groups.inviteMember(groupId, inviteEmail)
      setInviteEmail("")
      setActiveInviteGroupId(null)
      alert("User invited successfully! They must accept the invite in their inbox.")
    } catch (err: any) {
      alert(err.message || "Failed to invite user")
    }
  }

  const handleViewMembers = async (groupId: string) => {
    setActiveMembersGroupId(groupId)
    setLoadingMembers(true)
    try {
      const members = await api.groups.getMembers(groupId)
      setGroupMembers(members)
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to fetch members")
    } finally {
      setLoadingMembers(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground mt-2">
            Create groups to securely broadcast content to multiple users at once.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Group</DialogTitle>
              <DialogDescription>
                Groups allow you to share DRM-protected content with many users instantly.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Math 101 Students"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description (Optional)</Label>
                <Input
                  id="desc"
                  placeholder="What is this group for?"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : groups.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>No Groups Yet</CardTitle>
          <CardDescription className="mt-2 mb-4">
            Create a group to start building your secure community.
          </CardDescription>
          <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Create your first Group</Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.group_id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {group.name}
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  {group.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  <strong>{group.member_count}</strong> members
                </p>
              </CardContent>
              <CardFooter className="bg-muted/50 pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewMembers(group.group_id)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </Button>
                
                <Dialog open={activeInviteGroupId === group.group_id} onOpenChange={(open) => setActiveInviteGroupId(open ? group.group_id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite to {group.name}</DialogTitle>
                      <DialogDescription>
                        Invite a user to this group by their email address. They will receive an invite in their inbox.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <Label>User Email</Label>
                      <Input 
                        placeholder="user@example.com" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleInvite(group.group_id)}>Send Invite</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* View Members Dialog */}
      <Dialog open={activeMembersGroupId !== null} onOpenChange={(open) => !open && setActiveMembersGroupId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>
              Users who have access to content shared with this group.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {loadingMembers ? (
              <div className="flex justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : groupMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">No members found.</p>
            ) : (
              groupMembers.map(member => (
                <div key={member.user_id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{member.full_name || member.email}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="text-xs capitalize text-muted-foreground border px-2 py-1 rounded">
                    {member.role}
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveMembersGroupId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
