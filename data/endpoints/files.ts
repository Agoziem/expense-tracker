import { AxiosInstancemultipartWithToken } from "../instance";

// upload single file
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", file.name);
  formData.append("replace", "true");
  const response = await AxiosInstancemultipartWithToken.post(
    "files/upload/",
    formData
  );
  return response.data;
};

// upload multiple files
export const uploadMultipleFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
    formData.append("key", file.name);
    formData.append("replace", "true");
  });
  const response = await AxiosInstancemultipartWithToken.post(
    "files/upload-multiple/",
    formData
  );
  return response.data;
};

// delete file
export const useDeleteFile = async (file_url: string) => {
  const response = await AxiosInstancemultipartWithToken.delete("files/delete/", {
    data: {
      file_url,
    },
  });
  return response.data;
};
