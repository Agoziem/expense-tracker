import { CustomDialog } from "@/components/custom/custom-dialog";
import { Badge } from "@/components/ui/base-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useDisable2FA, useEnable2FA } from "@/data/endpoints/auth";
import { useGetUserProfile } from "@/data/endpoints/user";
import { CheckCircle, ShieldCheck, UserX, Verified, XCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const TwoFASection = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserProfile();
  const { mutateAsync: enable2FA, isLoading: submitting } = useEnable2FA();
  const { mutateAsync: disable2FA, isLoading: disabling } = useDisable2FA();
  const [open2FAModal, setOpen2FAModal] = useState(false);

  if (isUserLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
            <Spinner />
        </CardContent>
      </Card>
    );
  }


  if (userError || !user) {
      return (
        <Card>
          <CardContent className="pt-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <UserX className="h-6 w-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No User Data</EmptyTitle>
                <EmptyDescription>
                  We couldn't find any user information. Please try again later.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  className="mt-4 w-54"
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      );
    }

  return (
    <Card>
      <CardHeader className="items-center justify-between py-3">
        <div>
          <h2 className="text-xl font-bold">Verification & 2FA</h2>
          <p className="text-muted-foreground">
            Manage your account security settings
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Verification */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">
            Email Verification
          </h3>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {user?.is_verified ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">{user.email}</p>
                <p
                  className={`text-sm ${
                    user?.is_verified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user?.is_verified
                    ? "Email is verified"
                    : "Email is not verified"}
                </p>
              </div>
            </div>
            <div>
              {user?.is_verified ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-700/40 text-green-500 border-green-200 dark:border-green-500/40"
                >
                  <Verified className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 dark:bg-red-700/40 text-red-500 border-red-200 dark:border-red-500/40"
                  >
                    Not Verified
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Verify email clicked");
                      toast.info("Email verification coming soon");
                    }}
                  >
                    Verify Email
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Two-factor Authentication */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">
            Two-factor Authentication (2FA)
          </h3>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <ShieldCheck
                className={`h-5 w-5 ${
                  user?.two_factor_enabled ? "text-green-600" : "text-gray-400"
                }`}
              />
              <div>
                <p className="font-medium">2FA Status</p>
                <p
                  className={`text-sm ${
                    user?.two_factor_enabled
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {user?.two_factor_enabled
                    ? "Two-factor authentication is enabled"
                    : "Two-factor authentication is disabled"}
                </p>
              </div>
            </div>

            <CustomDialog
              open={open2FAModal}
              onOpenChange={setOpen2FAModal}
              trigger={
                <div>
                  {user?.two_factor_enabled ? (
                    <div className="flex flex-col space-y-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-700/40 text-green-500 border-green-200 dark:border-green-500/40 cursor-pointer"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        Enabled
                      </Badge>
                      <Button variant="outline" size="sm">
                        Disable 2FA
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-700/40 text-red-500 border-red-200 dark:border-red-500/40 cursor-pointer"
                      >
                        Disabled
                      </Badge>
                      <Button variant="outline" size="sm">
                        Enable 2FA
                      </Button>
                    </div>
                  )}
                </div>
              }
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {user?.two_factor_enabled
                    ? "Disable Two-Factor Authentication"
                    : "Enable Two-Factor Authentication"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 bg-muted p-3 px-4 rounded-md">
                  Two-factor authentication adds an extra layer of security to
                  your account. When enabled, you will need to provide a
                  verification code
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      if (user?.two_factor_enabled) {
                        disable2FA();
                      } else {
                        enable2FA();
                      }
                      setOpen2FAModal(false);
                    }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner />
                        Loading...
                      </>
                    ) : user?.two_factor_enabled ? (
                      "Disable 2FA"
                    ) : (
                      "Enable 2FA"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => setOpen2FAModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CustomDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFASection;
