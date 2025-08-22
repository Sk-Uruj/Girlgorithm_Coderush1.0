import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Brain, Users, Shield } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-serenity-soft">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackground} 
            alt="Serene landscape"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-serenity-gradient bg-clip-text text-transparent animate-slide-up">
            Serenity
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-8 animate-slide-up delay-100">
            Your AI-powered mental wellness companion designed for Gen-Z
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up delay-200">
            Break the stigma. Track your mood, practice mindfulness, and get personalized support 
            through our CBT-trained chatbot that understands you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-serenity transition-all duration-300 hover:scale-105">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How Serenity Helps You</h2>
            <p className="text-xl text-muted-foreground">Personalized mental wellness tools designed for your generation</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-serenity transition-all duration-300 hover:-translate-y-2 bg-card border-serenity-calm/20">
              <div className="w-16 h-16 bg-serenity-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Mood Tracking</h3>
              <p className="text-muted-foreground">Daily check-ins and emotional pattern recognition to understand your mental health journey</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-serenity transition-all duration-300 hover:-translate-y-2 bg-card border-serenity-calm/20">
              <div className="w-16 h-16 bg-serenity-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">AI Companion</h3>
              <p className="text-muted-foreground">CBT-trained chatbot offering personalized coping strategies and mindfulness practices</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-serenity transition-all duration-300 hover:-translate-y-2 bg-card border-serenity-calm/20">
              <div className="w-16 h-16 bg-serenity-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Community Support</h3>
              <p className="text-muted-foreground">Connect with others on similar journeys in a safe, moderated environment</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-serenity transition-all duration-300 hover:-translate-y-2 bg-card border-serenity-calm/20">
              <div className="w-16 h-16 bg-serenity-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Privacy First</h3>
              <p className="text-muted-foreground">Your mental health data is encrypted and secure. You own your wellness journey</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-serenity-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Find Your Serenity?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of Gen-Z individuals taking control of their mental wellness
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;