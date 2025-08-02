"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import statusChange, { addBio, addSkill } from "@/actions/profileAction";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    }),
});

export default function Profile() {
  const [bio, setBio] = useState("");
  const [skill, setSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      const result = await addBio(data.bio);

      if (result) {
        setBio(result.bio as string);
        toast.success("Bio updated successfully!");
      }

      router.replace("/dashboard");
    } catch (error) {
      toast.error("Failed to update bio");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddSkill() {
    if (!skill.trim()) return;

    try {
      const result = await addSkill(skill.trim());
      if (result) {
        toast.success(`Skill "${skill}" added successfully!`);
        setSkill("");
      }
    } catch (error) {
      toast.error("Failed to add skill");
    }
  }

  async function handleStatusChange() {
    try {
      await statusChange(true);
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

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
        className="w-full max-w-2xl"
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
            className="absolute top-6 right-6 w-4 h-4 bg-white/20 rounded-full"
            animate={{
              y: [0, -15, 0],
              x: [0, 8, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-8 left-8 w-3 h-3 bg-white/15 rounded-full"
            animate={{
              y: [0, 10, 0],
              x: [0, -5, 0],
              scale: [1, 0.7, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          <motion.div
            className="absolute top-1/2 right-8 w-2 h-2 bg-white/25 rounded-full"
            animate={{
              y: [0, -8, 0],
              x: [0, 3, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <div className="relative z-10 p-8">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold text-center mb-8 text-slate-800"
            >
              Complete Your Profile
            </motion.h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium text-sm">
                          Bio
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Textarea
                              placeholder="Tell us a little bit about yourself..."
                              className="resize-none bg-white/60 border-white/40 backdrop-blur-sm focus:bg-white/80 focus:border-white/60 transition-all duration-300 rounded-lg min-h-[100px] text-sm"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormLabel className="text-slate-700 font-medium text-sm mb-2 block">
                    Add Skills
                  </FormLabel>
                  <div className="flex gap-2">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1"
                    >
                      <Input
                        type="text"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        placeholder="Enter skill name"
                        className="bg-white/60 border-white/40 backdrop-blur-sm focus:bg-white/80 focus:border-white/60 transition-all duration-300 rounded-lg h-10 text-sm"
                      />
                    </motion.div>
                    <motion.div
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
                        className="bg-white/70 border-white/50 hover:bg-white/90 hover:border-white/70 text-slate-700 backdrop-blur-sm transition-all duration-300 rounded-lg px-4 text-sm"
                      >
                        Add Skill
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex gap-3 pt-4">
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white font-medium py-2.5 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                    >
                      {isLoading ? (
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
                          Updating...
                        </motion.span>
                      ) : (
                        "Update Bio"
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleStatusChange}
                      className="bg-white/70 border-white/50 hover:bg-white/90 hover:border-white/70 text-slate-700 backdrop-blur-sm transition-all duration-300 rounded-lg px-6 text-sm"
                    >
                      Update Status
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
