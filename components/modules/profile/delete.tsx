import { ConfirmDialog, CustomDialog } from "@/components/custom/custom-dialog";
import { Badge } from "@/components/ui/base-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser, useGetUserProfile } from "@/data/endpoints/user";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Alert, AlertDescription, AlertIcon } from "@/components/ui/alert";
import { Trash2, TriangleAlert } from "lucide-react";
import { useLogout } from "@/data/endpoints/auth";

const DeleteSection = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserProfile();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { mutateAsync: deleteUserMutation } = useDeleteUser();
  const { mutateAsync: logoutUser } = useLogout();

  // Handle user account deletion
  const handleDeleteUser = useCallback(async () => {
    if (!user?.id) {
      console.error("User ID not available for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserMutation(user.id);
      setShowModal(false);
      toast.success("Your account has been deleted successfully.");
      handleLogout();
    } catch (error) {
      console.error("Error deleting user:", error);
      // Error handling could be improved with toast notifications
    } finally {
      setIsDeleting(false);
    }
  }, [user?.id, deleteUserMutation]);

  // Handle user logout
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // User will be redirected after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="items-center justify-between py-3">
          <div>
            <h2 className="text-xl font-bold text-destructive">
              Delete Account
            </h2>
            <p className="text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <Alert variant="destructive" appearance={"light"} className="mb-4">
            <AlertIcon>
              <TriangleAlert />
            </AlertIcon>
            <AlertDescription>
              <strong>Warning:</strong> This action cannot be undone. All your
              data will be permanently deleted.
            </AlertDescription>
          </Alert>

          {/* Account Deletion Information */}
          <div>
            <h3 className="text-lg font-semibold text-destructive mb-4">
              Account Deletion
            </h3>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Before you delete your account, please note that:
              </p>

              <ul className="space-y-2 text-sm text-muted-foreground pl-4">
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    All your personal information will be permanently deleted
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    Your files history will be anonymized for our records
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>You will lose access to any uploaded files</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>All saved preferences and settings will be lost</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>
                    This action cannot be reversed under any circumstances
                  </span>
                </li>
              </ul>

              <div className="pt-4 space-y-2">
                <Button
                  variant="destructive"
                  onClick={() => setShowModal(true)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting || isLoggingOut ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Deleting Account...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  You will be asked to confirm this action.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showModal}
        onOpenChange={setShowModal}
        title={"Confirm Account Deletion"}
        description={"Are you sure you want to delete your account? This action cannot be undone."}
        onConfirm={handleDeleteUser}
        onCancel={() => {
            if (!isDeleting && !isLoggingOut) {
                setShowModal(false);
            }
        }}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
};

export default DeleteSection;
