const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  getSuccessfulPayments,
  createEvent,
  initiateBooking,
  // confirmPayment,
  downloadEventExcel,
  uploadEventsFromExcel,
  editEvent,
  deleteEvent,
  sendConfirmation,
  sendCancellation,
  //handleRazorpayWebhook,
  handlePayuWebhook,
  handlePayuSuccess,
  handlePayuFailure,
  getTodaysEventsByVenue,
  getEventReports,
  getEventsByVenue,
  getEventsWithPayments,
  refundPayment,
  sendBookingNotifications,
} = require("../controllers/eventController");
const verifyAdmin = require("../middleware/verifyAdmin"); // Import the middleware
const upload = require("../middleware/uploadFile");

router.post("/upload", upload.single("file"), uploadEventsFromExcel);
router.get("/excel", downloadEventExcel);
router.post("/add-event", createEvent);
router.put("/:id", editEvent);
router.delete("/:id", deleteEvent);

router.get("/", getAllEvents);

//today's event Routes
router.get("/today/by-venue", getTodaysEventsByVenue);
router.get("/by-venue", getEventsByVenue);

//event daily report
router.get("/today/report", getEventReports);

router.get("/:id", getEventById);
router.get("/:id/successful-payments", getSuccessfulPayments);

// Razorpay routes
// router.post("/webhook/razorpay", handleRazorpayWebhook);
// router.post("/:id/book", initiateBooking);
// router.post("/:id/confirm", confirmPayment);

// PayU routes
router.post("/:id/book", initiateBooking);
router.post("/webhook/payu", handlePayuWebhook);
router.post("/payu/success", handlePayuSuccess);
router.post("/payu/failure", handlePayuFailure);

router.post("/:id/send-confirmation", sendConfirmation);
router.post("/:id/send-cancellation", sendCancellation);

// Refund section: Get events with successful payments
router.get("/refunds/events-with-payments", verifyAdmin, getEventsWithPayments);

// Refund route (admin only)
router.post("/:id/refund/:participantId", verifyAdmin, refundPayment);

// Refund multiple participants (admin only)
router.post("/:eventId/refund", verifyAdmin, refundPayment);

// Send booking notifications for 75% and 100% levels
router.post("/:id/send-booking-notification", sendBookingNotifications);

module.exports = router;
