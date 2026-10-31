import { Toast } from "@heroui/react";
import { useEffect } from "react";

interface ErrorNotificationProps {
  code: string;
  message: string;
  content: string;
}

export default function ErrorNotification({ code, message, content }: ErrorNotificationProps) {
  useEffect(() => {
    if (!code || !message) return;

    const title = `Error ${code}: ${message}`;

    if (code.startsWith("4")) {
      Toast.toast.warning(title, { description: content });
    } else if (code.startsWith("5")) {
      Toast.toast.danger(title, { description: content });
    } else {
      Toast.toast.info(title, { description: content });
    }
  }, [code, message, content]);

  return null;
}
