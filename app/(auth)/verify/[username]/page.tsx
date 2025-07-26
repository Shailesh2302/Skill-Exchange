"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useActionState } from "react";
import verifyAction from "@/actions/verifyAction";
import {
  Shield,
  Mail,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const [state, formAction, isPending] = useActionState(verifyAction, {
    success: false,
    message: "",
  });

  const onSubmit = (data: z.infer<typeof verifySchema>) => {
    const formData = new FormData();
    formData.append("username", params.username);
    formData.append("code", data.code);
    formAction(formData);
  };

  // Success Toast & Redirect Effect
  if (state.success) {
    toast.success("Success", { description: state.message });
    router.replace("/sign-in");
  } else if (state.message && !state.success) {
    toast.error("Verification Failed", { description: state.message });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <Input
                  placeholder="Enter 6-digit code"
                  {...field}
                  className="pl-10 h-14 text-center text-xl"
                  maxLength={6}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
