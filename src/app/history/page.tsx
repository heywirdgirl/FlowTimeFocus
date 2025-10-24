// src/app/history/page.tsx
"use client";

import { useHistory } from "@/contexts/history-context";
import { useCycle } from "@/contexts/cycle-context";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  Calendar, Clock, Flame, Target, TrendingUp, Award, AlertCircle, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HistoryPage() {
  const { trainingHistory } = useHistory();
  const { allCycles } = useCycle();

  // === TÍNH TOÁN THỐNG KÊ ===
  const totalSessions = trainingHistory.length;
  const totalMinutes = trainingHistory.reduce((acc, h) => acc + h.totalDuration, 0);
  const completedSessions = trainingHistory.filter(h => h.status === "completed").length;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Streak hiện tại
  const sortedHistory = [...trainingHistory].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  let currentStreak = 0;
  const seenDates = new Set<string>();
  for (const h of sortedHistory) {
    const date = format(new Date(h.completedAt), "yyyy-MM-dd");
    if (!seenDates.has(date) && h.status === "completed") {
      seenDates.add(date);
      currentStreak++;
    } else if (seenDates.has(date)) {
      continue;
    } else {
      break;
    }
  }

  // Dữ liệu 7 ngày gần nhất
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekData = weekDays.map(day => {
    const dayStr = format(day, "yyyy-MM-dd");
    const sessions = trainingHistory.filter(h => 
      format(new Date(h.completedAt), "yyyy-MM-dd") === dayStr
    );
    const minutes = sessions.reduce((acc, h) => acc + h.totalDuration, 0);
    return {
      name: format(day, "EEE"),
      date: format(day, "MMM dd"),
      minutes,
      sessions: sessions.length,
      isToday: isToday(day),
    };
  });

  // Dữ liệu theo cycle
  const cycleStats = allCycles.map(cycle => {
    const sessions = trainingHistory.filter(h => h.cycleId === cycle.id);
    const total = sessions.reduce((acc, h) => acc + h.totalDuration, 0);
    return {
      name: cycle.name,
      sessions: sessions.length,
      minutes: total,
      color: cycle.id === "cycle_pomodoro" ? "#10b981" : cycle.id === "cycle_template_wimhof" ? "#3b82f6" : "#8b5cf6",
    };
  }).filter(c => c.sessions > 0);

  // Phân loại trạng thái
  const statusData = [
    { name: "Hoàn thành", value: completedSessions, color: "#10b981" },
    { name: "Bị gián đoạn", value: totalSessions - completedSessions, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Lịch Sử Luyện Tập <Target className="h-8 w-8 text-primary" />
            </h1>
            <p className="text-muted-foreground">Theo dõi hành trình làm chủ thời gian của bạn</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Flame className="h-5 w-5 mr-1" /> Streak: {currentStreak} ngày
            </Badge>
            {currentStreak >= 3 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <Award className="h-4 w-4 mr-1" /> Consistent
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            title="Tổng buổi"
            value={totalSessions}
            subtitle="lần luyện tập"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            title="Tổng thời gian"
            value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
            subtitle="tập trung"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            title="Tỷ lệ hoàn thành"
            value={`${completionRate}%`}
            subtitle={
              <Progress value={completionRate} className="mt-2 h-2" />
            }
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="Buổi hôm nay"
            value={weekData.find(d => d.isToday)?.sessions || 0}
            subtitle="hoàn thành"
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="cycles">Theo chu kỳ</TabsTrigger>
            <TabsTrigger value="sessions">Chi tiết</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WEEKLY CHART */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" /> Tuần này
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weekData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload?.[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 border rounded shadow-lg">
                                <p className="font-semibold">{data.date}</p>
                                <p className="text-sm">{data.minutes}m • {data.sessions} buổi</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="minutes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* STATUS PIE */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" /> Trạng thái
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {statusData.map(s => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-sm">{s.name}: {s.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CYCLES TAB */}
          <TabsContent value="cycles" className="space-y-4">
            {cycleStats.length > 0 ? (
              cycleStats.map((cycle, i) => (
                <motion.div
                  key={cycle.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{cycle.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cycle.sessions} buổi • {cycle.minutes} phút
                          </p>
                        </div>
                        <div className="w-full max-w-xs">
                          <Progress value={(cycle.minutes / totalMinutes) * 100} className="h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-10 text-muted-foreground">
                  Chưa có dữ liệu luyện tập nào.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SESSIONS TAB */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Phiên luyện tập gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {sortedHistory.map((session, i) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {session.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{session.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(session.completedAt), "dd MMM yyyy, HH:mm")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{session.totalDuration}m</p>
                          {session.notes && (
                            <p className="text-xs text-muted-foreground italic">"{session.notes}"</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ icon, title, value, subtitle }: { icon: React.ReactNode; title: string; value: string | number; subtitle?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {typeof subtitle === "string" ? <p className="text-xs text-muted-foreground">{subtitle}</p> : subtitle}
      </CardContent>
    </Card>
  );
}