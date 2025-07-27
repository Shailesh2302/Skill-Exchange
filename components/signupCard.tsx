"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  * as z  from "zod";
import { useActionState, useEffect } from "react";
import signupAction from "@/actions/signUpAction";
import { signUpSchema } from "@/schemas/signUpSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupCard() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter()

  const [state, formAction, isPending] = useActionState(signupAction, {
    success: false,
    error: null,
    message: "",
    username: "",
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    await formAction(formData);
  };

  useEffect(() => {
    if (!state || "status" in state) return; // This skips if state is a Response object

    if (state.error) {
      toast.error(state.error);
    }
    
    if (state.success) {
      toast.success(state.message || "Please verify the code");
      router.replace(`/verify/${state.username}`);
    }
  }, [state]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Signing Up..." : "Sign Up"}
        </Button>
        {state &&
          typeof state === "object" &&
          "error" in state &&
          state.error && <p className="text-red-500">{state.error}</p>}
      </form>
    </Form>
  );
}
