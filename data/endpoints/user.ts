import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosInstanceWithToken } from "@/data/instance";
import { ChangeRoleSchema } from "@/validators/schemas/auth";
import { UserUpdateSchema } from "@/validators/schemas/user";
import {
  UserModel,
  UserResponseModel,
  ActivityResponse,
} from "@/validators/types/user";
import { z } from "zod";

// -----------------------------------------------
// User Management
// -------------------------------------------------

// Get all users
export const useGetAllUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "all"],
    queryFn: async (): Promise<UserResponseModel[]> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/all");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};

// Get user profile
export const useGetUserProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async (): Promise<UserModel> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/profile");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof UserUpdateSchema>) => {
      const validatedData = UserUpdateSchema.parse(data);
      const response = await AxiosInstanceWithToken.put(
        "/api/v1/user/update-user",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      queryClient.invalidateQueries(["user", "all"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await AxiosInstanceWithToken.delete(`/api/v1/user/delete_user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "all"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};

// Change user role
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof ChangeRoleSchema>) => {
      const validatedData = ChangeRoleSchema.parse(data);
      const response = await AxiosInstanceWithToken.post(
        "/api/v1/user/change-role",
        validatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "all"]);
      queryClient.invalidateQueries(["user", "profile"]);
    },
    onError: (error: any) => {
      throw error
    },
  });
};


// Get user activity
export const useGetUserActivity = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "activity"],
    queryFn: async (): Promise<ActivityResponse[]> => {
      const response = await AxiosInstanceWithToken.get("/api/v1/user/activity");
      return response.data;
    },
    enabled,
    onError: (error: any) => {
      throw error
    },
  });
};
