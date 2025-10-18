// AI Agent for analyzing alumni and generating personalized strategies
// Uses Vercel AI SDK for intelligent analysis

import { generateText } from "ai"
import type { Alumni, AIAnalysis, CampaignInsight } from "./types"

export async function analyzeAlumniEngagement(alumni: Alumni): Promise<AIAnalysis> {
  const prompt = `Analyze this alumni profile and provide engagement insights:
  
Name: ${alumni.name}
Graduation Year: ${alumni.graduationYear}
Major: ${alumni.major}
Total Donations: $${alumni.totalDonations}
Current Engagement Score: ${alumni.engagementScore}/100
Interests: ${alumni.interests.join(", ")}
Job Title: ${alumni.jobTitle}
Company: ${alumni.company}
Location: ${alumni.location}

Provide a JSON response with:
1. engagementPrediction (0-100): likelihood they'll engage with next campaign
2. recommendedApproach: personalized strategy for outreach
3. keyInterests: array of top 3 interests to focus on
4. optimalContactTime: best time to reach out
5. estimatedDonationPotential: estimated donation amount

Respond ONLY with valid JSON, no markdown.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    const analysis = JSON.parse(text)
    return {
      alumniId: alumni.id,
      engagementPrediction: analysis.engagementPrediction || alumni.engagementScore,
      recommendedApproach: analysis.recommendedApproach || "Personalized outreach based on interests",
      keyInterests: analysis.keyInterests || alumni.interests.slice(0, 3),
      optimalContactTime: analysis.optimalContactTime || "Tuesday-Thursday, 10am-2pm",
      estimatedDonationPotential: analysis.estimatedDonationPotential || alumni.lastDonation || 1000,
    }
  } catch (error) {
    console.error("Error analyzing alumni:", error)
    // Fallback analysis
    return {
      alumniId: alumni.id,
      engagementPrediction: alumni.engagementScore,
      recommendedApproach: `Reach out to ${alumni.name} with personalized content about ${alumni.interests[0]}`,
      keyInterests: alumni.interests.slice(0, 3),
      optimalContactTime: "Tuesday-Thursday, 10am-2pm",
      estimatedDonationPotential: alumni.lastDonation || 1000,
    }
  }
}

export async function generatePersonalizedCampaignMessage(
  alumni: Alumni,
  campaignName: string,
  campaignGoal: string,
): Promise<string> {
  const prompt = `Generate a personalized, compelling email message for this alumni:

Alumni: ${alumni.name}
Job Title: ${alumni.jobTitle}
Company: ${alumni.company}
Interests: ${alumni.interests.join(", ")}
Past Donations: $${alumni.totalDonations}
Campaign: ${campaignName}
Campaign Goal: ${campaignGoal}

Create a warm, professional email that:
1. References their specific interests and achievements
2. Explains how their contribution makes an impact
3. Includes a specific call-to-action
4. Is 150-200 words

Respond with ONLY the email body, no subject line or formatting.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })
    return text
  } catch (error) {
    console.error("Error generating message:", error)
    return `Dear ${alumni.name},\n\nWe hope you're doing well! We're reaching out because your support has been invaluable to our mission. We're launching ${campaignName} and would love your help in ${campaignGoal}.\n\nYour contribution would make a real difference.\n\nBest regards,\nThe Team`
  }
}

export async function generateCampaignInsights(
  campaignName: string,
  metrics: { openRate: number; clickRate: number; conversionRate: number },
): Promise<CampaignInsight> {
  const prompt = `Analyze these campaign metrics and provide insights:

Campaign: ${campaignName}
Open Rate: ${(metrics.openRate * 100).toFixed(1)}%
Click Rate: ${(metrics.clickRate * 100).toFixed(1)}%
Conversion Rate: ${(metrics.conversionRate * 100).toFixed(1)}%

Provide a JSON response with:
1. topPerformers: array of 2-3 recommendations for high performers
2. improvementAreas: array of 2-3 areas needing improvement
3. recommendedAdjustments: array of 2-3 specific adjustments to make
4. projectedROI: estimated ROI percentage

Respond ONLY with valid JSON, no markdown.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    const insights = JSON.parse(text)
    return {
      campaignId: "camp-001",
      topPerformers: insights.topPerformers || ["High engagement segment", "Tech industry alumni"],
      improvementAreas: insights.improvementAreas || ["Email subject lines", "Call-to-action clarity"],
      recommendedAdjustments: insights.recommendedAdjustments || [
        "A/B test subject lines",
        "Simplify donation process",
      ],
      projectedROI: insights.projectedROI || 250,
    }
  } catch (error) {
    console.error("Error generating insights:", error)
    return {
      campaignId: "camp-001",
      topPerformers: ["High engagement segment", "Tech industry alumni"],
      improvementAreas: ["Email subject lines", "Call-to-action clarity"],
      recommendedAdjustments: ["A/B test subject lines", "Simplify donation process"],
      projectedROI: 250,
    }
  }
}
