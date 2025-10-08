"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserUpdateSchema, UserUpdateType } from "@/validators/schemas/user";
import { useGetUserProfile, useUpdateUser } from "@/data/endpoints/user";
import { cn } from "@/lib/utils";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom Components
import AvatarUploader from "@/components/custom/avatar-upload";
import { uploadFile } from "@/data/endpoints/files";  
import { PhoneInput } from "@/components/ui/base-phone-input";
import LocationSelector from "@/components/custom/location-select";
import { Label } from "../../ui/label";
import SubmissionButton from "@/components/custom/submission-button";
import { EmptyPageLoading } from "@/components/custom/empty-page-loading";

interface ProfileFormProps {
  className?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ className }) => {
  const router = useRouter();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfile();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [updating, setUpdating] = useState(false);

  const form = useForm<UserUpdateType>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
      avatar: "",
      bio: "",
      gender: "",
      profile_completed: false,
    },
  });

  // Populate form with user data when available
  useEffect(() => {
    if (userProfile) {
      form.reset({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
        avatar: userProfile.avatar || "",
        bio: userProfile.bio || "",
        gender: userProfile.gender || "",
        profile_completed: userProfile.profile_completed,
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: UserUpdateType) => {
    setUpdating(true);
    try {
      // Set profile as completed before submission
      const updatedData = {
        ...data,
        profile_completed: true,
      };

      if (updatedData.avatar && updatedData.avatar instanceof File) {
        // Upload the new avatar file
        const uploadResponse = await uploadFile(updatedData.avatar);
        updatedData.avatar = uploadResponse.url;
      } else if (updatedData.avatar === null) {
        updatedData.avatar = "";
      }
      console.log("Submitting updated profile data:", updatedData);
      await updateUser(updatedData);
      toast.success("Profile updated successfully!");
      router.push("/"); // Redirect to dashboard after successful onboarding
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (profileLoading) {
    return (
      <EmptyPageLoading
        label="Loading profile..."
        description="Please wait while we fetch your profile data."
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="border-0 shadow-none">
        <CardContent className="px-8 pb-8">
          <div className="mb-6 px-3">
            <h5 className="text-xl font-bold text-primary dark:text-white">
              Complete Your Profile
            </h5>
            <div className="text-sm font-normal text-muted-foreground">
              Tell us more about yourself to personalize your experience
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Avatar Upload */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center">
                        <FormLabel className="mb-2">Profile Photo</FormLabel>
                        <FormControl>
                          <AvatarUploader
                            onFileChange={(file) => {
                              // Store the actual File object in the form state
                              field.onChange(file || null);
                            }}
                            defaultAvatar={
                              // Handle both File objects and string URLs
                              typeof field.value === "string" 
                                ? field.value 
                                : field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        value={field.value || ""}
                        popupClassName="w-[300px]"
                        scrollAreaClassName="h-[300px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Selector */}
              <div className="space-y-4">
                <Label>Location</Label>
                <LocationSelector
                  defaultCountry={form.watch("country")}
                  defaultState={form.watch("state")}
                  onCountryChange={(country) => {
                    form.setValue("country", country?.name || "");
                  }}
                  onStateChange={(state) => {
                    form.setValue("state", state?.name || "");
                  }}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="Enter your address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      key={field.value} // To reset when value changes
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-6">
                <SubmissionButton
                  isSubmitting={updating}
                  label="Update Profile"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
