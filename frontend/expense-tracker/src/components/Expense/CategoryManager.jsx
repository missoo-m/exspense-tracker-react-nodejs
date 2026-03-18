import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const CategoryManager = ({ categories, onChange }) => {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Разделяем категории на стандартные и пользовательские
  const defaultCategories = categories.filter(cat => cat.default);
  const userCategories = categories.filter(cat => !cat.default);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.CATEGORY.ADD, { name });
      onChange && onChange();
      setName("");
      toast.success("Category created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await axiosInstance.put(API_PATHS.CATEGORY.UPDATE(id), {
        name: editingName,
      });
      onChange && onChange();
      setEditingId(null);
      setEditingName("");
      toast.success("Category updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.CATEGORY.DELETE(id));
      onChange && onChange();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  useEffect(() => {
    if (editingId == null) {
      setEditingName("");
    }
  }, [editingId]);

  return (
    <div className="card mb-4">
      <h5 className="text-lg mb-3">Expense Categories</h5>

      {/* Добавление новой категории */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="input flex-1"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" className="add-btn add-btn-fill" onClick={handleCreate}>
          Add
        </button>
      </div>

      {/* Стандартные категории */}
      {defaultCategories.length > 0 && (
        <div className="mb-4">
          <h6 className="text-sm font-medium text-gray-500 mb-2">Default Categories</h6>
          <div className="flex flex-wrap gap-2">
            {defaultCategories.map((cat) => (
              <span
                key={cat._id}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Пользовательские категории */}
      {userCategories.length > 0 && (
        <div>
          <h6 className="text-sm font-medium text-gray-500 mb-2">Your Categories</h6>
          <ul className="space-y-2">
            {userCategories.map((cat) => (
              <li key={cat._id} className="flex items-center justify-between text-sm">
                {editingId === cat._id ? (
                  <>
                    <input
                      type="text"
                      className="input flex-1 mr-2"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-xs text-green-600 mr-2"
                      onClick={() => handleUpdate(cat._id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="text-xs text-gray-500"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs text-blue-600"
                        onClick={() => {
                          setEditingId(cat._id);
                          setEditingName(cat.name);
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.length === 0 && (
        <p className="text-xs text-gray-500">No categories yet. Add your first category!</p>
      )}
    </div>
  );
};

export default CategoryManager;