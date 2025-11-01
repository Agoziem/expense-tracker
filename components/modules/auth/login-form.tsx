"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/utils/auth";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import { LoginSchema, LoginSchemaType } from "@/validators/schemas/auth";
import { useLogin } from "@/data/endpoints/auth";
import { API_URL } from "@/data/constant";
import { PasswordInput } from "@/components/custom/password-input";
import { LoaderCircleIcon } from "lucide-react";
import SubmissionButton from "@/components/custom/submission-button";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const pathname = usePathname();
  const { storedValue, setValue } = useLocalStorage<string | null>(
    "persistRedirect",
    null
  );
  const { setValue: setPersistEmail } = useLocalStorage<string | null>(
    "persistEmail",
    null
  );
  const router = useRouter();
  const { mutateAsync: Login } = useLogin();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  // persist the Redirect URL in local storage
  useEffect(() => {
    if (redirect) {
      setValue(redirect);
    }
  }, [redirect]);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await Login(data);
      if ("two_factor_required" in response) {
        toast.success(response.message);
        reset();
        setPersistEmail(data.email);
        router.push("/verify-2FA");
      } else if ("verification_needed" in response) {
        toast.success(response.message);
        reset();
        setPersistEmail(data.email);
        router.push("/verify-email");
      } else {
        toast.success(response.message);
        reset();
        saveToken(response);
        if (!response?.user.profile_completed) {
          router.push("/onboarding");
        } else if (redirect) {
          const redirectUrl = storedValue || redirect;
          setValue(null);
          if (pathname === redirectUrl) {
            window.location.reload();
          } else {
            router.push(redirectUrl);
          }
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail?.message || "Login failed.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="mb-6 px-3 space-y-2">
            <h5 className="text-xl font-bold text-primary dark:text-white">
              Login to your account
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Please enter your email address and password to login.
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-3"
            >
      
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="Placeholder" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmissionButton isSubmitting={isSubmitting} label="Login" />

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
