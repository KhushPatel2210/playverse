import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../contant";
import { useAdmin } from "../contexts/AdminContext.jsx";
import EventsReports from "./EventReports.jsx";

const DownloadExcel = () => {
  const { isAdmin } = useAdmin();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState(null);

  useEffect(() => {
    fetchEventData(selectedDate);
  }, [selectedDate]);

  const fetchEventData = async (date = selectedDate) => {
    try {
      const token = localStorage.getItem("adminToken");
      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const response = await axios.get(
        `${apiUrl}/events/by-venue?date=${formattedDate}`,
        {
          headers: {
            "x-admin-token": token,
          },
        }
      );
      setEventData(response.data.venues);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError("Failed to load event data");
      setLoading(false);
    }
  };

  const handleConfirm = async (eventId) => {
    if (!window.confirm("Send confirmation to all participants?")) return;
    setIsLoading(true);
    setLoadingEventId(eventId);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${apiUrl}/events/${eventId}/send-confirmation`,
        {},
        { headers: { "x-admin-token": token } }
      );
      alert("Confirmation messages sent successfully!");
    } catch (error) {
      alert(
        error?.response?.data?.error ||
          "Failed to send confirmation messages. Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingEventId(null);
    }
  };

  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");

  const handleCancel = async (eventId) => {
    setShowCancelOptions(eventId);
  };

  const handleSendCancellation = async (eventId) => {
    if (!selectedCancelReason) {
      alert("Please select a cancellation reason.");
      return;
    }
    if (
      !window.confirm(
        `Send cancellation to all participants with reason: ${selectedCancelReason}?`
      )
    )
      return;

    setIsLoading(true);
    setLoadingEventId(eventId);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${apiUrl}/events/${eventId}/send-cancellation`,
        { reason: selectedCancelReason },
        { headers: { "x-admin-token": token } }
      );
      alert(
        `Cancellation messages sent successfully for reason: ${selectedCancelReason}!`
      );
      setShowCancelOptions(null);
      setSelectedCancelReason("");
    } catch (error) {
      alert(
        error?.response?.data?.error ||
          "Failed to send cancellation messages. Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingEventId(null);
    }
  };

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${apiUrl}/events/excel`, {
        responseType: "blob",
        headers: {
          "x-admin-token": token,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "events.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            isAdmin
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          type="button"
          onClick={downloadExcel}
          disabled={!isAdmin}
        >
          Download Excel
        </button>
      </div>

      <div className="mb-8">
        <EventsReports />
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Today's Event Statistics
        </h2>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Venue
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Event ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Event Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Sport
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Time
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Participants
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((venue, venueIndex) =>
              venue.events.map((event, eventIndex) => (
                <tr
                  key={`${venueIndex}-${eventIndex}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {eventIndex === 0 && (
                    <td
                      className="py-3 px-4 text-sm text-gray-600 border-b align-top"
                      rowSpan={venue.events.length}
                    >
                      {venue.venue} ({venue.totalEvents})
                    </td>
                  )}
                  <td className="py-3 px-4 text-sm text-blue-600 border-b underline">
                    <a
                      href={`/admin?search=${event._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-800"
                    >
                      {event._id}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b capitalize">
                    {event.sport}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event.time}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event.currentParticipants}/{event.participantsLimit}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b flex gap-2">
                    <button
                      onClick={() => handleConfirm(event._id)}
                      disabled={loadingEventId === event._id && isLoading}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-blue-600 ${
                        loadingEventId === event._id && isLoading
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-blue-50"
                      }`}
                    >
                      {loadingEventId === event._id && isLoading
                        ? "Sending..."
                        : "Confirm"}
                    </button>
                    {showCancelOptions === event._id ? (
                      <div className="flex flex-col gap-2">
                        <select
                          value={selectedCancelReason}
                          onChange={(e) =>
                            setSelectedCancelReason(e.target.value)
                          }
                          className="px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-gray-900 bg-gray-100 border border-gray-300"
                          disabled={isLoading}
                        >
                          <option value="">Select Reason</option>
                          <option value="Event postponed">
                            Event postponed
                          </option>
                          <option value="Venue unavailable">
                            Venue unavailable
                          </option>
                          <option value="Low participation">
                            Low participation
                          </option>
                          <option value="Other">Other (please specify)</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendCancellation(event._id)}
                            disabled={isLoading || !selectedCancelReason}
                            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-white ${
                              isLoading || !selectedCancelReason
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {isLoading ? "Sending..." : "Send Cancellation"}
                          </button>
                          <button
                            onClick={() => setShowCancelOptions(null)}
                            disabled={isLoading}
                            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-gray-600 ${
                              isLoading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCancel(event._id)}
                        disabled={loadingEventId === event._id && isLoading}
                        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-gray-600 ${
                          loadingEventId === event._id && isLoading
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {loadingEventId === event._id && isLoading
                          ? "Sending..."
                          : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadExcel;
