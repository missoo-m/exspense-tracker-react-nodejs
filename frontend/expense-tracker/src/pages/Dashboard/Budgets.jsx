import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

function currentMonth() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${m}`;
}

const Budgets = () => {
  useUserAuth();

  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  const budgetsByCategory = useMemo(() => {
    const map = new Map();
    (Array.isArray(budgets) ? budgets : []).forEach((b) => map.set(b.generalCategory, b));
    return map;
  }, [budgets]);

  const fetchCategories = async () => {
    const res = await axiosInstance.get(API_PATHS.CATEGORY.GET_ALL);
    setCategories(res.data || []);
  };

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.BUDGET.GET_BY_MONTH(month));
      setBudgets(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load budgets");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const upsertBudget = async (generalCategory, amount) => {
    const value = amount === "" ? "" : Number(amount);
    if (value !== "" && (Number.isNaN(value) || value < 0)) {
      toast.error("Invalid amount");
      return;
    }

    try {
      const res = await axiosInstance.post(API_PATHS.BUDGET.UPSERT, {
        month,
        generalCategory,
        amount: value === "" ? 0 : value,
      });
      const updated = res.data;
      setBudgets((prev) => {
        const idx = prev.findIndex((b) => b._id === updated._id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        }
        return [...prev, updated];
      });
      toast.success("Budget saved");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save budget");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  return (
    <DashboardLayout activeMenu="Budgets">
      <div className="my-5 mx-auto">
        <div className="card mb-4">
          <div className="flex items-center justify-between gap-4">
            <h5 className="text-lg">Monthly Budgets</h5>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Month</label>
              <input
                className="input"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Set budget per general expense category for the selected month.
          </p>
        </div>

        <div className="card">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {categories.map((c) => {
                const existing = budgetsByCategory.get(c.name);
                const value = existing?.amount ?? "";
                return (
                  <div
                    key={c._id}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {c.name} {c.default ? <span className="text-xs text-gray-400">(default)</span> : null}
                      </div>
                      <div className="text-xs text-gray-500">Budget amount</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="input w-32"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={value}
                        onBlur={(e) => upsertBudget(c.name, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm text-gray-500">No categories yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Budgets;

