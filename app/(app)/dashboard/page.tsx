"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  MessageSquare,
  Video,
  Bell,
  Search,
  Plus,
  Star,
  Clock,
  Users,
  Settings,
  Play,
  Award,
  ChevronRight,
  Filter,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import getUserAction from "@/actions/userAction";

// Types
interface UserData {
  id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string | null;
  status: boolean;
  skillsCount: number;
  connectionsCount: number;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
  color: string;
  bgColor: string;
  textColor: string;
}

interface FeaturedSkill {
  id: number;
  title: string;
  instructor: string;
  category: string;
  duration: string;
  students: number;
  rating: number;
  gradient: string;
  difficulty: string;
}

interface Activity {
  id: number;
  action: string;
  time: string;
  type: string;
}

interface Stats {
  totalMessages: number;
  videoCalls: number;
  skillsShared: number;
  connectionsMade: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [featuredSkills, setFeaturedSkills] = useState<FeaturedSkill[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user data
  const fetchUserData = async () => {
    try {
      // This would call your getUser function
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Failed to fetch user");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      // Fallback data for demo
      setUser({
        id: "1",
        username: "Alex Thompson",
        email: "alex@example.com",
        bio: "Creative Developer",
        profilePicture: null,
        status: true,
        skillsCount: 12,
        connectionsCount: 248,
      });
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const statsData = await response.json();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback data
      setStats({
        totalMessages: 142,
        videoCalls: 23,
        skillsShared: 8,
        connectionsMade: 45,
      });
    }
  };

  // Fetch user skills
  const fetchUserSkills = async () => {
    try {
      const response = await fetch("/api/skills/user");
      if (!response.ok) throw new Error("Failed to fetch skills");
      const skillsData = await response.json();
      setSkills(skillsData);
    } catch (error) {
      console.error("Error fetching skills:", error);
      // Fallback data
      setSkills([
        {
          id: 1,
          name: "React Development",
          category: "Development",
          level: "Advanced",
          color: "from-blue-400 to-blue-600",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        },
        {
          id: 2,
          name: "UI/UX Design",
          category: "Design",
          level: "Intermediate",
          color: "from-purple-400 to-pink-500",
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
        },
      ]);
    }
  };

  // Fetch featured skills
  const fetchFeaturedSkills = async () => {
    try {
      const response = await fetch("/api/skills/featured");
      if (!response.ok) throw new Error("Failed to fetch featured skills");
      const featuredData = await response.json();
      setFeaturedSkills(featuredData);
    } catch (error) {
      console.error("Error fetching featured skills:", error);
      // Fallback data
      setFeaturedSkills([
        {
          id: 1,
          title: "Master React & TypeScript",
          instructor: "Sarah Johnson",
          category: "Web Development",
          duration: "2h 30m",
          students: 1234,
          rating: 4.8,
          gradient: "from-blue-500 to-purple-600",
          difficulty: "Intermediate",
        },
        {
          id: 2,
          title: "UI Design Fundamentals",
          instructor: "Mike Chen",
          category: "Design",
          duration: "1h 45m",
          students: 2156,
          rating: 4.9,
          gradient: "from-pink-500 to-rose-500",
          difficulty: "Beginner",
        },
      ]);
    }
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/activity/recent");
      if (!response.ok) throw new Error("Failed to fetch activity");
      const activityData = await response.json();
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error fetching activity:", error);
      // Fallback data
      setRecentActivity([
        {
          id: 1,
          action: "Completed React Hooks tutorial",
          time: "2 hours ago",
          type: "completion",
        },
        {
          id: 2,
          action: "Connected with Maria Rodriguez",
          time: "4 hours ago",
          type: "connection",
        },
      ]);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        fetchStats(),
        fetchUserSkills(),
        fetchFeaturedSkills(),
        fetchRecentActivity(),
      ]);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Filter featured skills based on search
  const filteredFeaturedSkills = featuredSkills.filter(
    (skill) =>
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const SkillCard = ({ skill }: { skill: FeaturedSkill }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div
        className={`h-40 bg-gradient-to-br ${skill.gradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/15 rounded-full"></div>
        <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/25 rounded-full"></div>

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-semibold">
            {skill.difficulty}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Play className="w-5 h-5 text-gray-700 ml-0.5" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            {skill.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {skill.rating}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
          {skill.title}
        </h3>

        <p className="text-gray-600 mb-4">by {skill.instructor}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {skill.duration}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1.5" />
              {skill.students.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:scale-110">
              <Heart className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:scale-110">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Error loading user data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const result = getUserAction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SkillShare
              </h1>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-sm text-gray-500">Welcome back,</span>
                <span className="text-sm font-semibold text-gray-900">
                  {user.username}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <button className="p-2 text-gray-500 hover:text-purple-600 relative hover:scale-105 transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 text-gray-500 hover:text-purple-600 hover:scale-105 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {stats && (
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-8 left-12 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Continue Your Learning Journey
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Discover new skills and connect with fellow creatives
                  </p>
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Explore Skills
                  </button>
                </div>
                <div className="hidden lg:block">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Skills Learned", value: stats.skillsShared },
                      { label: "Connections", value: stats.connectionsMade },
                      { label: "Messages", value: stats.totalMessages },
                      { label: "Video Calls", value: stats.videoCalls },
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-blue-200 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Skills */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Skills
                  {searchQuery && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({filteredFeaturedSkills.length} results)
                    </span>
                  )}
                </h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium hover:scale-105 transition-all">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFeaturedSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>

              {filteredFeaturedSkills.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No skills found matching `{searchQuery}`
                  </p>
                </div>
              )}
            </div>

            {/* Your Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-102"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`px-3 py-1 ${skill.bgColor} ${skill.textColor} rounded-full text-xs font-semibold`}
                        >
                          {skill.category}
                        </div>
                        <Award className="w-5 h-5 text-gray-400" />
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2">
                        {skill.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {skill.level}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                            style={{
                              width:
                                skill.level === "Beginner"
                                  ? "30%"
                                  : skill.level === "Intermediate"
                                    ? "60%"
                                    : "90%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {user.username}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{user.bio}</p>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div
                    className={`w-2 h-2 rounded-full ${user.status ? "bg-green-500" : "bg-gray-400"}`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {user.status ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xl font-bold text-purple-600">
                      {user.skillsCount}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">
                      Skills
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">
                      {user.connectionsCount}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Connections
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Edit Profile
                </button>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
                    { icon: Video, color: "bg-green-50 text-green-600" },
                    { icon: Plus, color: "bg-purple-50 text-purple-600" },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className={`p-3 rounded-lg ${action.color} transition-all duration-200 hover:scale-110`}
                    >
                      <action.icon className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.type === "completion"
                            ? "bg-green-500"
                            : activity.type === "connection"
                              ? "bg-blue-500"
                              : activity.type === "start"
                                ? "bg-purple-500"
                                : "bg-orange-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
