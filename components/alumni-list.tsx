"use client"

import { useState } from "react"
import type { Alumni } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface AlumniListProps {
  alumni: Alumni[]
}

export default function AlumniList({ alumni }: AlumniListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"engagement" | "donations" | "name">("engagement")

  const filteredAlumni = alumni
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "engagement") return b.engagementScore - a.engagementScore
      if (sortBy === "donations") return b.totalDonations - a.totalDonations
      return a.name.localeCompare(b.name)
    })

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alumni Directory</CardTitle>
          <CardDescription>Search and manage alumni profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="engagement">Sort by Engagement</option>
              <option value="donations">Sort by Donations</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredAlumni.map((alum) => (
              <div
                key={alum.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{alum.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {alum.jobTitle} at {alum.company}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {alum.interests.slice(0, 2).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <Badge className={getEngagementColor(alum.engagementScore)}>{alum.engagementScore}</Badge>
                  </div>
                  <div className="text-sm font-semibold text-foreground">${alum.totalDonations.toLocaleString()}</div>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
