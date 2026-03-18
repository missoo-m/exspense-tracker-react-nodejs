
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState } from "react";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income =() =>{
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [ loading, setLoading] =useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ from: "", to: "", source: "" });
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  })
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  //Get All Income Details
   const fetchIncomeDetails = async (nextPage = page) => {
    if (loading) return;

    try {
      setLoading(true);
      const params = {
        page: nextPage,
        size: 10,
        from: filters.from || undefined,
        to: filters.to || undefined,
        source: filters.source || undefined,
      };
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME, { params });
      const data = response.data;

      // Поддержка двух форматов:
      // 1) новый: { items, page, totalPages, ... }
      // 2) старый: [ ...items ]
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const normalized = items.map((x) => ({ ...x, _id: x?._id ?? x?.id }));
      setIncomeData(normalized);
      setPage(typeof data?.page === "number" ? data.page : 0);
      setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 1);
    } catch (error) {
      console.log("Something went wrong. Please try again", error);
      toast.error(error?.response?.data?.message || `Failed to load income (${error?.response?.status || "network"})`);
    } finally {
      setLoading(false);
    }
    };

   //Handle Add Income
   const handleAddIncome = async (income) => {
    const {source, amount, date, icon }= income;

    if(!source.trim()) {
      toast.error("Source is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if(!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails(0);
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }
   };

   // Delete Income
   const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails(0);
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
   };

   //handle download income details
   const handleDownloadIncomeDetails = async () => {
    try {
      const response= await axiosInstance.get(
      API_PATHS.INCOME.DOWNLOAD_INCOME,
      {
        responseType: "blob",
      }
    );
    //Create a URL for the blob
    const url =window.URL.createObjectURL (new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download","income_details.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    } catch {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.")
    }
   };


   useEffect(() => {
    fetchIncomeDetails(0);
    return () => {};
   },[]);

  return (
    <DashboardLayout activeMenu= "Income">
      <div className="my-5 mx-auto">
        <div className="card mb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-gray-500">From</label>
              <input className="input" type="date" value={filters.from} onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500">To</label>
              <input className="input" type="date" value={filters.to} onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))} />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="text-xs text-gray-500">Source contains</label>
              <input className="input w-full" type="text" value={filters.source} onChange={(e) => setFilters((p) => ({ ...p, source: e.target.value }))} placeholder="Salary, Freelance..." />
            </div>
            <button type="button" className="add-btn add-btn-fill" onClick={() => fetchIncomeDetails(0)}>
              Apply
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
               transactions={incomeData}
               onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>


          <IncomeList
             transactions={incomeData}
             onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id })
             }}
             onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            className="add-btn"
            disabled={page <= 0}
            onClick={() => fetchIncomeDetails(page - 1)}
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
            onClick={() => fetchIncomeDetails(page + 1)}
          >
            Next
          </button>
        </div>

       <Modal
         isOpen={openAddIncomeModal}
         onClose={() => setOpenAddIncomeModal(false)}
         title= " Add Income"
      >
        <AddIncomeForm onAddIncome ={handleAddIncome}/>
      </Modal>

      <Modal
         isOpen={openDeleteAlert.show}
         onClose={() => setOpenDeleteAlert({show: false, data: null})}
         title= "Delete income"
      >
        <DeleteAlert
          content="Are you  sure you want to delete this income deteil?"
          onDelete={() => deleteIncome(openDeleteAlert.data)}
        />
      </Modal>

      </div>
    </DashboardLayout>
  )


}
export default Income