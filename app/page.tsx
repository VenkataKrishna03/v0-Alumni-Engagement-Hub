"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { mockAlumni, mockCampaigns } from "@/lib/mock-data"
import AlumniList from "@/components/alumni-list"
import CampaignManager from "@/components/campaign-manager"
import AIInsights from "@/components/ai-insights"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Calculate dashboard metrics
  const totalAlumni = mockAlumni.length
  const totalDonations = mockAlumni.reduce((sum, a) => sum + a.totalDonations, 0)
  const avgEngagementScore = Math.round(mockAlumni.reduce((sum, a) => sum + a.engagementScore, 0) / mockAlumni.length)
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active").length

  // Campaign performance data
  const campaignData = mockCampaigns.map((c) => ({
    name: c.name.substring(0, 12),
    raised: c.raised / 1000,
    goal: c.goal / 1000,
  }))

  // Engagement distribution
  const engagementData = [
    { name: "High (80+)", value: mockAlumni.filter((a) => a.engagementScore >= 80).length },
    {
      name: "Medium (50-79)",
      value: mockAlumni.filter((a) => a.engagementScore >= 50 && a.engagementScore < 80).length,
    },
    { name: "Low (<50)", value: mockAlumni.filter((a) => a.engagementScore < 50).length },
  ]

  const COLORS = ["#5b21b6", "#3b82f6", "#fbbf24"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alumni Engagement Hub</h1>
              <p className="mt-1 text-sm text-muted-foreground">AI-powered fundraising and engagement optimization</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">New Campaign</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Alumni</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totalAlumni}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active in database</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${(totalDonations / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{avgEngagementScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">Score out of 100</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{activeCampaigns}</div>
                  <p className="text-xs text-muted-foreground mt-1">Running now</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Funds raised vs. goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={campaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="raised" fill="#5b21b6" name="Raised ($K)" />
                      <Bar dataKey="goal" fill="#e5e7eb" name="Goal ($K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Distribution</CardTitle>
                  <CardDescription>Alumni by engagement level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alumni Tab */}
          <TabsContent value="alumni">
            <AlumniList alumni={mockAlumni} />
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <CampaignManager campaigns={mockCampaigns} />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            <AIInsights alumni={mockAlumni} campaigns={mockCampaigns} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
