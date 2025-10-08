import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/base-alert-dialog';
import { removeToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLogout } from "@/data/endpoints/auth";
import { LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

type LogoutModalProps = {
  open: boolean;
  handleToggle: (open: boolean) => void;
};

const LogoutModal = ({ open, handleToggle }: LogoutModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();

  const Logout = async () => {
    setSubmitting(true);
    try {
      const response = await logout();
      toast.success(response?.message || "Logout successful!");
      removeToken();
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.detail?.message || "Login failed.");
    }
    setSubmitting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <LogOut className="size-5 text-muted-foreground" />
            Logout</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to logout?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogClose>Cancel</AlertDialogClose>
          <AlertDialogAction onClick={Logout} disabled={submitting}>
            {submitting ? <Spinner /> : ""}
            {submitting ? "Logging out..." : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
