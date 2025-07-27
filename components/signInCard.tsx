"use client";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

const SignInCard = () => {
   const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 

  const onSubmit =async (data: z.infer<typeof signInSchema>) => {
  setIsSubmitting(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.email,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Login Failed", {
            description: "Incorrect username or password",
          });
        } else {
          toast.error("Error", {
            description: result.error,
          });
        }
      } else if (result?.url) {
        toast.success("Welcome back!", {
          description: "You have been successfully signed in.",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Sign In Failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      x: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants: Variants = {
    idle: {
      scale: 1,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const glassVariants: Variants = {
    initial: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
    },
    animate: {
      background: [
        "rgba(255, 255, 255, 0.1)",
        "rgba(255, 255, 255, 0.15)",
        "rgba(255, 255, 255, 0.1)",
      ],
      backdropFilter: ["blur(10px)", "blur(15px)", "blur(10px)"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <motion.div
          variants={glassVariants}
          initial="initial"
          animate="animate"
          className="relative rounded-3xl border border-white/30 shadow-xl backdrop-blur-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)",
          }}
        >
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-75"
            style={{
              background:
                "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Floating orbs for liquid effect */}
          <motion.div
            className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full"
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-6 left-6 w-2 h-2 bg-white/15 rounded-full"
            animate={{
              y: [0, 8, 0],
              x: [0, -3, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          <div className="relative z-10 p-6">
            <motion.h2
              variants={itemVariants}
              className="text-xl font-semibold text-center mb-6 text-slate-800"
            >
              Welcome Back
            </motion.h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium text-sm">
                          Email
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              placeholder="Your email"
                              {...field}
                              className="bg-white/60 border-white/40 backdrop-blur-sm focus:bg-white/80 focus:border-white/60 transition-all duration-300 rounded-lg h-10 text-sm"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium text-sm">
                          Password
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Your password"
                              {...field}
                              className="bg-white/60 border-white/40 backdrop-blur-sm focus:bg-white/80 focus:border-white/60 transition-all duration-300 rounded-lg h-10 text-sm"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white font-medium py-2.5 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                    >
                      {isSubmitting ? (
                        <motion.span
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Signing In...
                        </motion.span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Sign Up Link */}
                <motion.div variants={itemVariants} className="text-center">
                  <Link
                    href="/sign-up"
                    className="text-xs text-slate-600 hover:text-slate-800 transition-colors duration-200"
                  >
                    Don&apos;t have an account?{" "}
                    <span className="font-medium text-slate-700 hover:text-slate-900">
                      Sign Up
                    </span>
                  </Link>
                </motion.div>
              </form>
            </Form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignInCard;
