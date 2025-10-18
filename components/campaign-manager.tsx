"use client"

import type { Campaign } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface CampaignManagerProps {
  campaigns: Campaign[]
}

export default function CampaignManager({ campaigns }: CampaignManagerProps) {
  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-100 text-green-800"
    if (status === "draft") return "bg-gray-100 text-gray-800"
    return "bg-blue-100 text-blue-800"
  }

  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </div>
              <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fundraising Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Fundraising Progress</span>
                <span className="text-sm text-muted-foreground">
                  ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                </span>
              </div>
              <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Open Rate</p>
                <p className="text-lg font-semibold text-foreground">{(campaign.openRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Click Rate</p>
                <p className="text-lg font-semibold text-foreground">{(campaign.clickRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-lg font-semibold text-foreground">{(campaign.conversionRate * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium text-foreground">{new Date(campaign.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium text-foreground">{new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Target Alumni</p>
                <p className="font-medium text-foreground">{campaign.targetAlumni.length} alumni</p>
              </div>
              <div>
                <p className="text-muted-foreground">Strategy</p>
                <p className="font-medium text-foreground text-xs">{campaign.personalizationStrategy}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Edit Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
