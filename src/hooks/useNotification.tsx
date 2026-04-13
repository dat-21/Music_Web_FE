import toast from 'react-hot-toast';
import { CheckCircle2, Info, AlertCircle, XCircle } from 'lucide-react';

const useNotification = () => {
  // ✅ Hàm cho thông báo thành công
  const showSuccess = (message = 'Thành công', title?: string) => {
    toast.success(
      () => (
        <div className="flex flex-col gap-0.5">
          {title && <span className="font-semibold text-sm">{title}</span>}
          <span className="text-sm opacity-90">{message}</span>
        </div>
      ),
      { duration: 3000, icon: <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" /> }
    );
  };

  // ✅ Hàm cho thông báo thông tin
  const showInfo = (message = 'Thông tin', title?: string) => {
    toast(
      () => (
        <div className="flex flex-col gap-0.5">
          {title && <span className="font-semibold text-sm">{title}</span>}
          <span className="text-sm opacity-90">{message}</span>
        </div>
      ),
      { duration: 3000, icon: <Info className="text-blue-500 w-5 h-5 flex-shrink-0" /> }
    );
  };

  // ✅ Hàm cho thông báo cảnh báo
  const showWarning = (message = 'Cảnh báo', title?: string) => {
    toast(
      () => (
        <div className="flex flex-col gap-0.5">
          {title && <span className="font-semibold text-sm">{title}</span>}
          <span className="text-sm opacity-90">{message}</span>
        </div>
      ),
      { duration: 3000, icon: <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" /> }
    );
  };

  // ✅ Hàm cho thông báo lỗi
  const showError = (message = 'Lỗi', title?: string) => {
    toast.error(
      () => (
        <div className="flex flex-col gap-0.5">
          {title && <span className="font-semibold text-sm">{title}</span>}
          <span className="text-sm opacity-90">{message}</span>
        </div>
      ),
      { duration: 4000, icon: <XCircle className="text-red-500 w-5 h-5 flex-shrink-0" /> }
    );
  };

  return { showSuccess, showInfo, showWarning, showError };
};

export default useNotification;
