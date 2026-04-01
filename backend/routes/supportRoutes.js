// backend/routes/supportRoutes.js
import express from "express";
import SupportTicket from "../models/SupportTicket.js";
import emailService from "../services/emailService.js";

const router = express.Router();

// Create support ticket
router.post("/tickets", async (req, res) => {
  console.log("📨 Received POST request to /tickets");
  console.log("Request body:", req.body);

  try {
    const { name, email, subject, message, urgencyLevel } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, subject, message"
      });
    }

    // Create ticket
    const ticket = new SupportTicket({
      name,
      email,
      subject,
      message,
      urgencyLevel: urgencyLevel || "medium",
    });

    await ticket.save();
    console.log("✅ Ticket created:", ticket.ticketNumber);

    // Try to send emails (don't fail if email fails)
    try {
      await emailService.sendSupportConfirmation(ticket);
      await emailService.sendSupportNotification(ticket);
      console.log("✅ Confirmation emails sent");
    } catch (emailError) {
      console.error("⚠️ Email sending failed:", emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket: {
        number: ticket.ticketNumber,
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("❌ Error creating support ticket:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create support ticket",
    });
  }
});

// Get ticket status
router.get("/tickets/:ticketNumber", async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      ticketNumber: req.params.ticketNumber,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      ticket: {
        number: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
    });
  }
});

export default router;