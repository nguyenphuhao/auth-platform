import { ShieldCheck, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md border bg-surface-elevated">
            <ShieldCheck className="h-5 w-5 text-accent" />
          </div>
          <CardTitle>Sign in with Phone OTP</CardTitle>
          <CardDescription>
            Foundation UI only. API contracts are connected, but OTP business logic/service is intentionally not implemented yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="space-y-2 text-sm">
            <span className="font-medium">Phone number</span>
            <Input placeholder="+84 9xx xxx xxx" />
          </label>
          <Button className="w-full">
            <Smartphone className="mr-2 h-4 w-4" />
            Request OTP
          </Button>
          <label className="space-y-2 text-sm">
            <span className="font-medium">OTP code</span>
            <Input inputMode="numeric" maxLength={6} placeholder="123456" />
          </label>
          <Button variant="secondary" className="w-full">
            Verify OTP
          </Button>
          <Toast title="Demo mode" description="Use API routes from Swagger to validate request/response contracts." tone="warning" />
        </CardContent>
      </Card>
    </div>
  );
}
