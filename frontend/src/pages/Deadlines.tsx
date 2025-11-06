import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bell,
  Target,
  TrendingUp,
  Plus,
} from "lucide-react";
import { activityService, Activity } from "../services/activityService";
import { format, addDays, differenceInDays, isPast, isFuture, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface ActivityWithDeadline extends Activity {
  daysUntilDeadline?: number;
  urgency?: "overdue" | "urgent" | "soon" | "normal";
}

interface DeadlineStats {
  overdue: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

export function Deadlines() {
  const [activities, setActivities] = useState<ActivityWithDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<DeadlineStats>({
    overdue: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    try {
      setLoading(true);
      const response = await activityService.getActivities();
      
      if (response.success && response.data) {
        // Calculer les deadlines et urgences
        const activitiesWithDeadlines = response.data
          .filter((activity: Activity) => 
            activity.status !== "completed" && 
            activity.status !== "evaluated" &&
            activity.endDate
          )
          .map((activity: Activity) => {
            const endDate = new Date(activity.endDate!);
            const today = new Date();
            const daysUntil = differenceInDays(endDate, today);
            
            let urgency: "overdue" | "urgent" | "soon" | "normal" = "normal";
            if (isPast(endDate) && !isToday(endDate)) {
              urgency = "overdue";
            } else if (isToday(endDate)) {
              urgency = "urgent";
            } else if (daysUntil <= 7) {
              urgency = "soon";
            }

            return {
              ...activity,
              daysUntilDeadline: daysUntil,
              urgency,
            };
          })
          .sort((a, b) => {
            if (!a.endDate || !b.endDate) return 0;
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          });

        setActivities(activitiesWithDeadlines);

        // Calculer les statistiques
        const now = new Date();
        const weekFromNow = addDays(now, 7);
        const monthFromNow = addDays(now, 30);

        const newStats = {
          overdue: activitiesWithDeadlines.filter(a => a.urgency === "overdue").length,
          today: activitiesWithDeadlines.filter(a => isToday(new Date(a.endDate!))).length,
          thisWeek: activitiesWithDeadlines.filter(a => {
            const endDate = new Date(a.endDate!);
            return isFuture(endDate) && endDate <= weekFromNow;
          }).length,
          thisMonth: activitiesWithDeadlines.filter(a => {
            const endDate = new Date(a.endDate!);
            return isFuture(endDate) && endDate <= monthFromNow;
          }).length,
          total: activitiesWithDeadlines.length,
        };

        setStats(newStats);
      }
    } catch (err) {
      console.error("Erreur chargement échéances:", err);
      setError("Erreur lors du chargement de vos échéances");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "overdue":
        return <Badge variant="destructive">En retard</Badge>;
      case "urgent":
        return <Badge className="bg-orange-500 text-white">Aujourd'hui</Badge>;
      case "soon":
        return <Badge className="bg-yellow-500 text-white">Cette semaine</Badge>;
      default:
        return <Badge variant="outline">À venir</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "submitted":
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const filterActivities = (activities: ActivityWithDeadline[]) => {
    switch (activeTab) {
      case "overdue":
        return activities.filter(a => a.urgency === "overdue");
      case "urgent":
        return activities.filter(a => a.urgency === "urgent");
      case "week":
        return activities.filter(a => a.urgency === "soon");
      default:
        return activities;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Chargement de vos échéances...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredActivities = filterActivities(activities);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            Mes Échéances
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Suivez les deadlines de vos activités LED
          </p>
        </div>
        <Button
          onClick={() => window.location.href = "/activities"}
          className="bg-gradient-to-r from-blue-600 to-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle activité
        </Button>
      </div>

      {/* Statistiques d'échéances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Activités dépassées
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.today}</div>
            <p className="text-xs text-muted-foreground mt-1">
              À rendre aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">
              7 prochains jours
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              30 prochains jours
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Activités en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de filtrage */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Toutes ({activities.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-red-600">
            En retard ({stats.overdue})
          </TabsTrigger>
          <TabsTrigger value="urgent" className="text-orange-600">
            Urgentes ({stats.today})
          </TabsTrigger>
          <TabsTrigger value="week" className="text-yellow-600">
            Cette semaine ({stats.thisWeek})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune échéance</h3>
                <p className="text-muted-foreground">
                  Vous n'avez pas d'activité avec une deadline dans cette catégorie.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(activity.status)}
                          {activity.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {activity.description.substring(0, 150)}...
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        {getUrgencyBadge(activity.urgency!)}
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {format(new Date(activity.endDate!), "dd MMMM yyyy", { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className={
                          activity.urgency === "overdue" 
                            ? "font-bold text-red-600" 
                            : activity.urgency === "urgent"
                            ? "font-bold text-orange-600"
                            : ""
                        }>
                          {activity.daysUntilDeadline === 0
                            ? "Aujourd'hui"
                            : activity.daysUntilDeadline! < 0
                            ? `${Math.abs(activity.daysUntilDeadline!)} jour(s) de retard`
                            : `Dans ${activity.daysUntilDeadline} jour(s)`}
                        </span>
                      </div>
                      {activity.estimatedHours && (
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span>{activity.estimatedHours}h estimées</span>
                        </div>
                      )}
                    </div>
                    {activity.objectives && activity.objectives.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Objectifs :</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {activity.objectives.slice(0, 2).map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                          {activity.objectives.length > 2 && (
                            <li className="text-blue-600">+{activity.objectives.length - 2} autres...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
