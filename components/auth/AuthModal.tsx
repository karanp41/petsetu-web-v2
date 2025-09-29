"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "./AuthProvider";

const registerSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type RegisterValues = z.infer<typeof registerSchema>;

type LoginValues = z.infer<typeof loginSchema>;

interface AuthModalProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  triggerClassName,
  triggerLabel = "Login/Signup",
}) => {
  const { register: doRegister, login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);

  const regForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const logForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleRegister = regForm.handleSubmit(async (values) => {
    setLoading(true);
    try {
      await doRegister({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast({
        title: "Registration successful",
        description: "Welcome to PetSetu!",
      });
      setOpen(false);
      router.push("/profile");
    } catch (e: any) {
      toast({ title: "Registration failed", description: e.message });
    } finally {
      setLoading(false);
    }
  });

  const handleLogin = logForm.handleSubmit(async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast({ title: "Logged in", description: "Welcome back!" });
      setOpen(false);
      router.push("/profile");
    } catch (e: any) {
      toast({ title: "Login failed", description: e.message });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tab === "register" ? "Create your account" : "Sign in"}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="register" className="mt-4 space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Full Name
                </label>
                <Input
                  placeholder="John Doe"
                  disabled={loading}
                  {...regForm.register("name")}
                />
                {regForm.formState.errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {regForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  {...regForm.register("email")}
                />
                {regForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {regForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••"
                  disabled={loading}
                  {...regForm.register("password")}
                />
                {regForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {regForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : "Register"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="login" className="mt-4 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  {...logForm.register("email")}
                />
                {logForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {logForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••"
                  disabled={loading}
                  {...logForm.register("password")}
                />
                {logForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {logForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : "Login"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
