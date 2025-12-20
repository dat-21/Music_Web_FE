import { notifications } from '@mantine/notifications';
import type { NotificationData } from '@mantine/notifications'; // ⚙️ Import type
import { IconCheck, IconInfoCircle, IconExclamationCircle, IconX } from '@tabler/icons-react';

const useNotification = () => {
  const defaultOptions: NotificationData = {
    autoClose: 3000,
    withCloseButton: true,
    position: 'top-right',
    title: 'Default Notification',
    message: 'You have a new notification!',
  };

  // ✅ Gán kiểu rõ ràng cho options
  const showNotification = (options: NotificationData) => {
    notifications.show({
      ...defaultOptions,
      ...options,
    });
  };

  // ✅ Hàm cho thông báo thành công
  const showSuccess = (message = 'Success', title = 'Success') => {
    showNotification({
      message,
      title,
      color: 'green',
      icon: <IconCheck size={18} />,
    });
  };

  // ✅ Hàm cho thông báo thông tin
  const showInfo = (message = 'Some message god give for you that:', title = 'Info') => {
    showNotification({
      message,
      title,
      color: 'blue',
      icon: <IconInfoCircle size={18} />,
    });
  };

  // ✅ Hàm cho thông báo cảnh báo
  const showWarning = (message = 'Warning', title = 'Warning') => {
    showNotification({
      message,
      title,
      color: 'yellow',
      icon: <IconExclamationCircle size={18} />,
    });
  };

  // ✅ Hàm cho thông báo lỗi
  const showError = (message = 'Error', title = 'Error') => {
    showNotification({
      message,
      title,
      color: 'red',
      icon: <IconX size={18} />,
    });
  };

  return { showNotification, showSuccess, showInfo, showWarning, showError };
};

export default useNotification;
