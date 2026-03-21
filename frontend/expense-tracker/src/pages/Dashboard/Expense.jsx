
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import CategoryManager from "../../components/Expense/CategoryManager";
import GlassDatePicker from "../../components/Inputs/GlassDatePicker";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    generalCategory: "",
  });
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async (nextPage = page) => {
    if (loading) return;

    try {
      const params = {
        page: nextPage,
        size: 10,
        from: filters.from || undefined,
        to: filters.to || undefined,
        generalCategory: filters.generalCategory || undefined,
      };
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE, { params });
      const data = response.data;

      // Поддержка двух форматов:
      // 1) новый: { items, page, totalPages, ... }
      // 2) старый: [ ...items ]
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const normalized = items.map((x) => ({ ...x, _id: x?._id ?? x?.id }));
      setExpenseData(normalized);
      setPage(typeof data?.page === "number" ? data.page : 0);
      setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 1);
    } catch (error) {
      console.log("Something went wrong. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.CATEGORY.GET_ALL);
      const list = Array.isArray(res.data) ? res.data : [];
      setCategories(list.map((c) => ({ ...c, _id: c?._id ?? c?.id })));
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, generalCategory, description, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        generalCategory,
        description,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails(0);
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails(0);
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails(0);
    fetchCategories();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <CategoryManager categories={categories} onChange={fetchCategories} />

        <div className="card mb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <GlassDatePicker
                label="From"
                value={filters.from}
                onChange={(v) => setFilters((p) => ({ ...p, from: v }))}
              />
            </div>
            <div>
              <GlassDatePicker
                label="To"
                value={filters.to}
                onChange={(v) => setFilters((p) => ({ ...p, to: v }))}
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="text-xs text-gray-500">General category</label>
              <select
                className="custom-date-input"
                value={filters.generalCategory}
                onChange={(e) => setFilters((p) => ({ ...p, generalCategory: e.target.value }))}
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c?._id ?? c?.id ?? c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="add-btn add-btn-fill h-[52px] px-6 text-base"
              onClick={() => fetchExpenseDetails(0)}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            className="add-btn"
            disabled={page <= 0}
            onClick={() => fetchExpenseDetails(page - 1)}
          >
            Prev
          </button>
          <div className="text-xs text-gray-500">
            Page {page + 1} of {Math.max(totalPages, 1)}
          </div>
          <button
            type="button"
            className="add-btn"
            disabled={page + 1 >= totalPages}
            onClick={() => fetchExpenseDetails(page + 1)}
          >
            Next
          </button>
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title=" Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expenses"
        >
          <DeleteAlert
            content="Are you  sure you want to delete this expense deteil?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
