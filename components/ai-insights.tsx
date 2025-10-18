"use client"

import { useState } from "react"
import type { Alumni, Campaign } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { analyzeAlumniEngagement, generatePersonalizedCampaignMessage, generateCampaignInsights } from "@/lib/ai-agent"

interface AIInsightsProps {
  alumni: Alumni[]
  campaigns: Campaign[]
}

export default function AIInsights({ alumni, campaigns }: AIInsightsProps) {
  const [selectedAlumni, setSelectedAlumni] = useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [insights, setInsights] = useState<any>(null)

  const handleAnalyzeAlumni = async (alumniId: string) => {
    setLoading(true)
    setSelectedAlumni(alumniId)
    const alum = alumni.find((a) => a.id === alumniId)
    if (alum) {
      const result = await analyzeAlumniEngagement(alum)
      setAnalysis(result)
    }
    setLoading(false)
  }

  const handleGenerateMessage = async (alumniId: string, campaignId: string) => {
    setLoading(true)
    const alum = alumni.find((a) => a.id === alumniId)
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (alum && campaign) {
      const result = await generatePersonalizedCampaignMessage(alum, campaign.name, campaign.description)
      setMessage(result)
    }
    setLoading(false)
  }

  const handleGenerateInsights = async (campaignId: string) => {
    setLoading(true)
    setSelectedCampaign(campaignId)
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign) {
      const result = await generateCampaignInsights(campaign.name, {
        openRate: campaign.openRate,
        clickRate: campaign.clickRate,
        conversionRate: campaign.conversionRate,
      })
      setInsights(result)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Alumni Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni Engagement Analysis</CardTitle>
          <CardDescription>AI-powered analysis of individual alumni engagement potential</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {alumni.map((alum) => (
              <Button
                key={alum.id}
                variant={selectedAlumni === alum.id ? "default" : "outline"}
                onClick={() => handleAnalyzeAlumni(alum.id)}
                className="justify-start"
              >
                {alum.name}
              </Button>
            ))}
          </div>

          {loading && selectedAlumni && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner className="h-4 w-4" />
              Analyzing alumni...
            </div>
          )}

          {analysis && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Prediction</p>
                <p className="text-2xl font-bold text-foreground">{analysis.engagementPrediction}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recommended Approach</p>
                <p className="text-foreground">{analysis.recommendedApproach}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Key Interests</p>
                <div className="flex gap-2 flex-wrap">
                  {analysis.keyInterests.map((interest: string) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Optimal Contact Time</p>
                <p className="text-foreground">{analysis.optimalContactTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Donation Potential</p>
                <p className="text-lg font-semibold text-foreground">
                  ${analysis.estimatedDonationPotential.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personalized Message Generation */}
      {selectedAlumni && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Personalized Message</CardTitle>
            <CardDescription>Create AI-generated personalized outreach messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {campaigns.map((campaign) => (
                <Button
                  key={campaign.id}
                  variant="outline"
                  onClick={() => handleGenerateMessage(selectedAlumni, campaign.id)}
                  className="justify-start"
                >
                  {campaign.name}
                </Button>
              ))}
            </div>

            {loading && message === null && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Generating message...
              </div>
            )}

            {message && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Generated Message</p>
                <p className="text-foreground whitespace-pre-wrap">{message}</p>
                <Button size="sm" variant="outline">
                  Copy Message
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Campaign Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Insights</CardTitle>
          <CardDescription>AI analysis of campaign metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {campaigns.map((campaign) => (
              <Button
                key={campaign.id}
                variant={selectedCampaign === campaign.id ? "default" : "outline"}
                onClick={() => handleGenerateInsights(campaign.id)}
                className="justify-start"
              >
                {campaign.name}
              </Button>
            ))}
          </div>

          {loading && selectedCampaign && insights === null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner className="h-4 w-4" />
              Analyzing campaign...
            </div>
          )}

          {insights && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Top Performers</p>
                <ul className="space-y-1">
                  {insights.topPerformers.map((item: string, idx: number) => (
                    <li key={idx} className="text-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Areas for Improvement</p>
                <ul className="space-y-1">
                  {insights.improvementAreas.map((item: string, idx: number) => (
                    <li key={idx} className="text-foreground flex items-start gap-2">
                      <span className="text-accent">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Recommended Adjustments</p>
                <ul className="space-y-1">
                  {insights.recommendedAdjustments.map((item: string, idx: number) => (
                    <li key={idx} className="text-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projected ROI</p>
                <p className="text-2xl font-bold text-foreground">{insights.projectedROI}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
