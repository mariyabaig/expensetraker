import React, { useState } from "react";
import { DateTime } from "luxon";

const Income = () => {
  const [income, setIncome] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = income;

    try {
      const response = await fetch("http://localhost:8000/addincome", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const newIncome = await response.json();
      setSubmittedData([...submittedData, newIncome]);
      setIncome({
        amount: "",
        date: "",
        category: "",
      });
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setIncome(submittedData[index]);
  };

  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };

  const totalIncome = submittedData.reduce((total, data) => {
    return total + parseInt(data.amount);
  }, 0);

  return (
    <>
      <div className="flex flex-row">
        <div className="card my-5 mx-5">
          <div className="card-overlay"></div>
          <h3 className="font-bold">Total Income: {totalIncome}</h3>
          <form onSubmit={handleSubmit}>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Income Amount
              <input
                type="number"
                value={income.amount}
                onChange={(event) =>
                  setIncome({ ...income, amount: event.target.value })
                }
                required
              />
            </label>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Date
              <input
                type="date"
                value={income.date}
                onChange={(event) =>
                  setIncome({ ...income, date: event.target.value })
                }
                required
              />
            </label>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Category
              <select
                value={income.category}
                onChange={(event) =>
                  setIncome({ ...income, category: event.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Food">Salary</option>
                <option value="Transportation">Refund</option>
                <option value="Housing">Others</option>
              </select>
            </label>
            <button className="bg-blue-300 mt-4" type="submit">
              {editIndex !== null ? "Save Changes" : "Submit"}
            </button>
          </form>
        </div>

        {submittedData.length > 0 && (
          <div className="card  my-5 mx-5">
            <div className="card-overaly"></div>
            <h2 className="font-bold">Submitted Data</h2>
            <table>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.amount}</td>
                    <td>{data.category}</td>
                    <td>
                      {DateTime.fromISO(data.date).toFormat("dd LLL yy")}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Income;
