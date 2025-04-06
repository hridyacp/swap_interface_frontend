
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toast, dismiss } = useToast()

  return (
    <ToastProvider>
      {toast && typeof toast === 'function' && (
        <div className="hidden">
          {/* This component is kept for compatibility but we're using Sonner toasts now */}
        </div>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}
