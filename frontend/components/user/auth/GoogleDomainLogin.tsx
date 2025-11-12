"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { loginWithGoogleIdToken } from "@/services/authService";
import { ErrorDialog } from "../ErrorDialog";

function getEmailFromIdToken(idToken: string): string | null {
  try {
    const payload = JSON.parse(atob(idToken.split(".")[1] || ""));
    return payload?.email ?? null;
  } catch {
    return null;
  }
}

type GoogleDomainLoginProps = {
  allowedDomain: string;
  onSuccessRoute?: string;
  buttonText?: "signin_with" | "signup_with" | "continue_with" | "signin";
  size?: "large" | "medium" | "small";
  shape?: "pill" | "rectangular" | "circle" | "square";
  onDeniedEmail?: (email: string | null) => void;
  onBackendError?: (message: string) => void;
};

export function GoogleDomainLogin({
  allowedDomain,
  onSuccessRoute = "/user",
  buttonText = "signin_with",
  size = "large",
  shape = "pill",
  onDeniedEmail,
  onBackendError,
}: GoogleDomainLoginProps) {
  const router = useRouter();
  const [inlineError, setInlineError] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  const openDialog = (msg: string) => {
    setDialogMsg(msg);
    setDialogOpen(true);
  };

  const handleSuccess = async (cred: CredentialResponse) => {
    try {
      const idToken = cred.credential!;
      const email = getEmailFromIdToken(idToken);
      if (!email || !email.endsWith(`@${allowedDomain}`)) {
        onDeniedEmail?.(email);
        openDialog(`Please use your university email (@${allowedDomain}) to sign in.`);
        return;
      }
      await loginWithGoogleIdToken(idToken);
      router.replace(onSuccessRoute);
    } catch (e: any) {
      const msg = e?.message || "Login failed";
      setInlineError(msg);
      onBackendError?.(msg);
    }
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setInlineError("Google login failed")}
        useOneTap={false}
        text={buttonText}
        size={size}
        shape={shape}
      />

      {inlineError && (
        <div className="mt-3 text-center text-sm text-red-600">{inlineError}</div>
      )}

      <ErrorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Sign-In Restricted"
        message={dialogMsg}
        actionText="OK"
      />
    </>
  );
}
