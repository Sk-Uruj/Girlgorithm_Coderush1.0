import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Timer, Heart, Sparkles } from "lucide-react";

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: "meditation" | "breathing" | "sleep" | "anxiety" | "gratitude";
  audioUrl?: string;
  type: "guided" | "timer" | "breathing";
}

const meditationSessions: MeditationSession[] = [
  {
    id: "1",
    title: "Mindful Breathing",
    description: "A simple 5-minute breathing exercise to center yourself",
    duration: 5,
    category: "breathing",
    type: "breathing"
  },
  {
    id: "2",
    title: "Body Scan Meditation",
    description: "Progressive relaxation through body awareness",
    duration: 10,
    category: "meditation",
    type: "guided"
  },
  {
    id: "3",
    title: "Sleep Preparation",
    description: "Gentle meditation to help you drift into peaceful sleep",
    duration: 15,
    category: "sleep",
    type: "guided"
  },
  {
    id: "4",
    title: "Anxiety Relief",
    description: "Quick techniques to calm anxious thoughts",
    duration: 8,
    category: "anxiety",
    type: "guided"
  },
  {
    id: "5",
    title: "Gratitude Practice",
    description: "Cultivate appreciation and positive mindset",
    duration: 7,
    category: "gratitude",
    type: "guided"
  }
];

const MeditationPlayer = () => {
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCount, setBreathingCount] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    };
  }, []);

  const startSession = (session: MeditationSession) => {
    setCurrentSession(session);
    setDuration(session.duration * 60); // Convert to seconds
    setCurrentTime(0);
    setIsPlaying(true);
    
    if (session.type === "breathing") {
      startBreathingExercise();
    } else {
      startTimer();
    }
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          handleSessionComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const startBreathingExercise = () => {
    if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    
    let phaseDuration = 4000; // 4 seconds per phase
    let currentPhase = "inhale";
    
    breathingIntervalRef.current = setInterval(() => {
      setBreathingPhase(currentPhase as "inhale" | "hold" | "exhale");
      
      if (currentPhase === "inhale") {
        currentPhase = "hold";
        phaseDuration = 2000; // 2 seconds hold
      } else if (currentPhase === "hold") {
        currentPhase = "exhale";
        phaseDuration = 4000; // 4 seconds exhale
      } else {
        currentPhase = "inhale";
        phaseDuration = 4000; // 4 seconds inhale
        setBreathingCount(prev => prev + 1);
      }
      
      // Update interval for next phase
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = setInterval(() => {
        startBreathingExercise();
      }, phaseDuration);
    }, phaseDuration);
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    
    // Show completion message
    alert("Session completed! Great job taking time for yourself. 🌟");
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    } else {
      setIsPlaying(true);
      if (currentSession?.type === "breathing") {
        startBreathingExercise();
      } else {
        startTimer();
      }
    }
  };

  const skipForward = () => {
    const newTime = Math.min(currentTime + 30, duration);
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 30, 0);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstructions = () => {
    switch (breathingPhase) {
      case "inhale":
        return { text: "Breathe In", color: "text-blue-600", bgColor: "bg-blue-100" };
      case "hold":
        return { text: "Hold", color: "text-purple-600", bgColor: "bg-purple-100" };
      case "exhale":
        return { text: "Breathe Out", color: "text-green-600", bgColor: "bg-green-100" };
      default:
        return { text: "Ready", color: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Meditation & Wellness
        </h1>
        <p className="text-xl text-muted-foreground">
          Take a moment to breathe, reflect, and find your center
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Session List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Available Sessions</h2>
          {meditationSessions.map((session) => (
            <Card 
              key={session.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => startSession(session)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {session.category === "meditation" && <Sparkles className="w-4 h-4 text-purple-500" />}
                    {session.category === "breathing" && <Heart className="w-4 h-4 text-blue-500" />}
                    {session.category === "sleep" && <Timer className="w-4 h-4 text-indigo-500" />}
                    <span className="text-sm text-muted-foreground">{session.duration}m</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{session.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Player */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Current Session</h2>
          
          {currentSession ? (
            <Card className="p-6">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{currentSession.title}</CardTitle>
                <p className="text-muted-foreground">{currentSession.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Breathing Exercise Display */}
                {currentSession.type === "breathing" && (
                  <div className="text-center">
                    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-4 transition-all duration-1000 ${
                      getBreathingInstructions().bgColor
                    }`}>
                      <span className={getBreathingInstructions().color}>
                        {breathingPhase === "inhale" ? "↗" : breathingPhase === "hold" ? "●" : "↘"}
                      </span>
                    </div>
                    <p className={`text-xl font-semibold ${getBreathingInstructions().color}`}>
                      {getBreathingInstructions().text}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Breath count: {breathingCount}
                    </p>
                  </div>
                )}

                {/* Timer Display */}
                {currentSession.type !== "breathing" && (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-4">
                      {formatTime(duration - currentTime)}
                    </div>
                    <Progress 
                      value={(currentTime / duration) * 100} 
                      className="w-full h-3"
                    />
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={skipBackward}
                    className="w-12 h-12 rounded-full"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={skipForward}
                    className="w-12 h-12 rounded-full"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([value]) => {
                      setVolume(value);
                      setIsMuted(value === 0);
                    }}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {isMuted ? 0 : volume}%
                  </span>
                </div>

                {/* Session Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>Session Type: {currentSession.type}</p>
                  <p>Duration: {currentSession.duration} minutes</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Active Session</h3>
                <p>Select a session from the left to begin your wellness journey</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeditationPlayer;
