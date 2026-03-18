import { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import toast from "react-hot-toast";

const AddExpenseForm = ({ onAddExpense, categories = [] }) => {
  const [expense, setExpense] = useState({
    categoryId: "", // теперь храним ID категории, а не название
    description: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) =>
    setExpense({
      ...expense,
      [key]: value,
    });

  const handleSubmit = () => {
    // Находим выбранную категорию по ID
    const selectedCategory = categories.find((c) => String(c._id) === String(expense.categoryId));
    
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    // Отправляем данные так, чтобы бэкенд получил:
    // generalCategory (общая категория) + description (уточнение)
    onAddExpense({
      ...expense,
      generalCategory: selectedCategory.name,
      category: selectedCategory.name,
    });
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* Только выпадающий список категорий */}
      <div className="mb-4">
        <label className="block text-xs font-medium mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={expense.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          required
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name} {cat.default ? "(Default)" : ""}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          You can add more categories in the category manager
        </p>
      </div>

      {/* Поле для уточнения */}
      <Input
        value={expense.description}
        onChange={({ target }) => handleChange("description", target.value)}
        label="Description (what was it spent on?)"
        placeholder="Groceries, taxi, cinema ticket..."
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="0.00"
        type="number"
        min="0"
        step="0.01"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;