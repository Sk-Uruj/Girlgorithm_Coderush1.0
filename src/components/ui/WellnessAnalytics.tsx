import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Activity, Calendar, Target, BarChart3, PieChart, LineChart, Moon, Sun, Zap } from "lucide-react";

interface MoodData {
  date: string;
  mood: string;
  intensity: number;
  note?: string;
}

interface SleepData {
  date: string;
  hours: number;
  quality: "excellent" | "good" | "fair" | "poor";
  mood: string;
}

interface WellnessScore {
  date: string;
  score: number;
  factors: {
    mood: number;
    sleep: number;
    activity: number;
    social: number;
  };
}

const WellnessAnalytics = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [wellnessScores, setWellnessScores] = useState<WellnessScore[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);

  useEffect(() => {
    loadData();
    calculateCurrentScore();
  }, [timeRange]);

  const loadData = () => {
    // Load mood data from localStorage
    const storedMoods = localStorage.getItem("moodEntries");
    if (storedMoods) {
      const moods = JSON.parse(storedMoods);
      const filteredMoods = filterDataByTimeRange(moods, timeRange);
      setMoodData(filteredMoods);
    }

    // Load sleep data (simulated for demo)
    const simulatedSleepData = generateSleepData(timeRange);
    setSleepData(simulatedSleepData);

    // Generate wellness scores
    const scores = generateWellnessScores(timeRange);
    setWellnessScores(scores);
  };

  const filterDataByTimeRange = (data: any[], range: string) => {
    const now = new Date();
    const daysAgo = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const generateSleepData = (range: string): SleepData[] => {
    const data: SleepData[] = [];
    const now = new Date();
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      data.push({
        date: date.toISOString().split('T')[0],
        hours: Math.random() * 3 + 6, // 6-9 hours
        quality: ["excellent", "good", "fair", "poor"][Math.floor(Math.random() * 4)] as any,
        mood: ["happy", "calm", "excited", "anxious", "sad", "angry", "tired", "grateful"][Math.floor(Math.random() * 8)]
      });
    }
    
    return data;
  };

  const generateWellnessScores = (range: string): WellnessScore[] => {
    const data: WellnessScore[] = [];
    const now = new Date();
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const moodScore = Math.random() * 40 + 60; // 60-100
      const sleepScore = Math.random() * 30 + 70; // 70-100
      const activityScore = Math.random() * 50 + 50; // 50-100
      const socialScore = Math.random() * 40 + 60; // 60-100
      
      data.push({
        date: date.toISOString().split('T')[0],
        score: Math.round((moodScore + sleepScore + activityScore + socialScore) / 4),
        factors: {
          mood: Math.round(moodScore),
          sleep: Math.round(sleepScore),
          activity: Math.round(activityScore),
          social: Math.round(socialScore)
        }
      });
    }
    
    return data;
  };

  const calculateCurrentScore = () => {
    if (wellnessScores.length > 0) {
      const latestScore = wellnessScores[wellnessScores.length - 1];
      setCurrentScore(latestScore.score);
    }
  };

  const getMoodTrend = () => {
    if (moodData.length < 2) return "stable";
    
    const recentMoods = moodData.slice(-7);
    const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.intensity, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.intensity, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.5) return "improving";
    if (secondAvg < firstAvg - 0.5) return "declining";
    return "stable";
  };

  const getSleepQuality = () => {
    if (sleepData.length === 0) return "unknown";
    
    const recentSleep = sleepData.slice(-7);
    const excellentCount = recentSleep.filter(sleep => sleep.quality === "excellent").length;
    const goodCount = recentSleep.filter(sleep => sleep.quality === "good").length;
    
    if (excellentCount >= 3) return "excellent";
    if (excellentCount + goodCount >= 5) return "good";
    if (excellentCount + goodCount >= 3) return "fair";
    return "poor";
  };

  const getMoodDistribution = () => {
    const moodCounts: { [key: string]: number } = {};
    moodData.forEach(item => {
      moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
    });
    
    return Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count, percentage: (count / moodData.length) * 100 }))
      .sort((a, b) => b.count - a.count);
  };

  const getWellnessInsights = () => {
    const insights = [];
    
    // Mood insights
    const moodTrend = getMoodTrend();
    if (moodTrend === "improving") {
      insights.push("Your mood has been improving over the past week! Keep up the positive momentum.");
    } else if (moodTrend === "declining") {
      insights.push("Your mood has been declining. Consider reaching out to friends or trying some self-care activities.");
    }
    
    // Sleep insights
    const sleepQuality = getSleepQuality();
    if (sleepQuality === "poor") {
      insights.push("Your sleep quality could improve. Try establishing a consistent bedtime routine.");
    } else if (sleepQuality === "excellent") {
      insights.push("Great sleep quality! This is likely contributing to your overall wellness.");
    }
    
    // Score insights
    if (currentScore >= 80) {
      insights.push("Excellent wellness score! You're doing great at maintaining balance in your life.");
    } else if (currentScore >= 60) {
      insights.push("Good wellness score. Small improvements in any area could boost your overall score.");
    } else {
      insights.push("Your wellness score suggests some areas for improvement. Focus on one area at a time.");
    }
    
    return insights;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Wellness Analytics
        </h1>
        <p className="text-xl text-muted-foreground">
          Track your progress and discover patterns in your wellness journey
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center mb-8">
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Current Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>{currentScore}</div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Mood Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{getMoodTrend()}</div>
            <p className="text-xs text-muted-foreground">past week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <Moon className="w-4 h-4" />
              <span>Sleep Quality</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{getSleepQuality()}</div>
            <p className="text-xs text-muted-foreground">past week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Entries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{moodData.length}</div>
            <p className="text-xs text-muted-foreground">in selected period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Wellness Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="w-5 h-5" />
              <span>Wellness Score Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-1">
              {wellnessScores.map((score, index) => (
                <div key={score.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t-sm ${getScoreBgColor(score.score)}`}
                    style={{ height: `${score.score}%` }}
                  ></div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {index % 7 === 0 ? new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your wellness score over the past {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Mood Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodData.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                No mood data available for the selected period
              </div>
            ) : (
              <div className="space-y-3">
                {getMoodDistribution().map((item) => (
                  <div key={item.mood} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm capitalize">{item.mood}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round(item.percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Sleep vs Mood Correlation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Sleep vs Mood</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sleepData.slice(-5).map((sleep) => (
                <div key={sleep.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{sleep.hours.toFixed(1)}h</span>
                    <Badge variant={sleep.quality === "excellent" ? "default" : "secondary"}>
                      {sleep.quality}
                    </Badge>
                  </div>
                  <span className="text-sm capitalize">{sleep.mood}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Factor Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Factor Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wellnessScores.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(wellnessScores[wellnessScores.length - 1].factors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{factor}</span>
                      <span className="font-medium">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getScoreBgColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getWellnessInsights().map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Based on your mood trends:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Try the breathing exercises when feeling anxious</li>
                <li>• Practice gratitude journaling daily</li>
                <li>• Consider meditation for better sleep quality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Wellness goals:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Aim for 7-9 hours of sleep consistently</li>
                <li>• Track your mood patterns weekly</li>
                <li>• Celebrate small wins and progress</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessAnalytics;
