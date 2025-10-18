// Data types for the fundraising assistant

export interface Alumni {
  id: string
  name: string
  email: string
  graduationYear: number
  major: string
  lastDonation?: number
  totalDonations: number
  engagementScore: number // 0-100
  lastEngagementDate?: string
  interests: string[]
  location: string
  jobTitle: string
  company: string
}

export interface Campaign {
  id: string
  name: string
  description: string
  targetAlumni: string[] // Alumni IDs
  personalizationStrategy: string
  status: "draft" | "active" | "completed"
  createdAt: string
  startDate: string
  endDate: string
  goal: number
  raised: number
  openRate: number
  clickRate: number
  conversionRate: number
}

export interface EngagementMetric {
  alumniId: string
  campaignId: string
  emailOpened: boolean
  linkClicked: boolean
  donated: boolean
  donationAmount?: number
  timestamp: string
}

export interface AIAnalysis {
  alumniId: string
  engagementPrediction: number // 0-100
  recommendedApproach: string
  keyInterests: string[]
  optimalContactTime: string
  estimatedDonationPotential: number
}

export interface CampaignInsight {
  campaignId: string
  topPerformers: string[] // Alumni IDs
  improvementAreas: string[]
  recommendedAdjustments: string[]
  projectedROI: number
}
