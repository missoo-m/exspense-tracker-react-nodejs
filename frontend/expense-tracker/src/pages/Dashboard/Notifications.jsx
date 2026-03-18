import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const Notifications = () => {
  useUserAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.NOTIFICATION.LIST);
      setItems(res.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axiosInstance.put(API_PATHS.NOTIFICATION.MARK_READ(id));
      setItems((prev) =>
        prev.map((n) => (String(n._id) === String(id) ? { ...n, read: true } : n))
      );
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to mark as read");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <DashboardLayout activeMenu="Notifications">
      <div className="my-5 mx-auto">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg">Notifications</h5>
            <button type="button" className="add-btn add-btn-fill" onClick={fetchAll}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 mt-4">Loading...</p>
          ) : items.length ? (
            <div className="mt-4 space-y-3">
              {items.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 rounded-lg border ${
                    n.read ? "border-gray-200 bg-white" : "border-[#ffb3c6] bg-[#fff7f8]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{n.type}</div>
                      <div className="text-sm text-gray-700 mt-1">{n.message}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {n.month ? `${n.month} • ` : ""}
                        {n.generalCategory ? `${n.generalCategory} • ` : ""}
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                      </div>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        className="text-xs text-primary underline"
                        onClick={() => markRead(n._id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">No notifications.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;

