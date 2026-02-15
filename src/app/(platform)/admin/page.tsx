import { Activity, ShieldAlert, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    title: "Users",
    value: "--",
    desc: "Will bind to /api/admin/users once service logic is added.",
    icon: Users
  },
  {
    title: "Security Alerts",
    value: "--",
    desc: "Placeholder status for anti-abuse metrics.",
    icon: ShieldAlert
  },
  {
    title: "Login Events",
    value: "--",
    desc: "Will bind to /api/admin/users/{id}/login-events.",
    icon: Activity
  }
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6 reveal">
      <header>
        <h1 className="text-2xl font-semibold">Admin Foundation Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Skeleton UI + API contracts are ready. Domain service and data wiring are intentionally deferred.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="reveal">
              <CardHeader className="pb-2">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-2xl">{item.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Icon className="h-4 w-4 text-accent" />
                  <span>{item.desc}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
