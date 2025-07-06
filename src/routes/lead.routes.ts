import { Router } from "express"
import {
  submitLead,
  getLeads,
  convertLeadToClientAndSchedule,
} from "../controllers/lead.controller"
import asyncHandler from "../utils/asyncHandler"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       required: [name, email, property]
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         name:
 *           type: string
 *           example: "Jane Smith"
 *         email:
 *           type: string
 *           example: "jane.smith@example.com"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         message:
 *           type: string
 *           example: "Interested in the property."
 *         property:
 *           type: string
 *           description: Property ID
 *           example: "60d0fe4f5311236168a109cb"
 *         status:
 *           type: string
 *           enum: [new, contacted, converted, archived]
 *           example: "new"
 *         convertedToClient:
 *           type: string
 *           description: Client ID if converted
 *           example: "60d0fe4f5311236168a109cc"
 *         submittedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Submit a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *     responses:
 *       201:
 *         description: Lead submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 */
router.post("/", asyncHandler(submitLead))

/**
 * @swagger
 * components:
 *   schemas:
 *     LeadResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lead'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: number
 *               description: Current page number
 *               example: 1
 *             limit:
 *               type: number
 *               description: Number of items per page
 *               example: 10
 *             total:
 *               type: number
 *               description: Total count of leads
 *               example: 50
 *             totalPages:
 *               type: number
 *               description: Total number of pages
 *               example: 5
 *             hasNext:
 *               type: boolean
 *               description: Whether there is a next page
 *               example: true
 *             hasPrevious:
 *               type: boolean
 *               description: Whether there is a previous page
 *               example: false
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Get all leads with pagination
 *     tags: [Leads]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of leads
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeadResponse'
 */
router.get("/", asyncHandler(getLeads))

/**
 * @swagger
 * /api/leads/{leadId}/convert-and-schedule:
 *   post:
 *     summary: Convert a lead to a client and schedule a viewing
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, time]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date for the viewing (YYYY-MM-DD)
 *                 example: "2024-01-15"
 *               time:
 *                 type: string
 *                 pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
 *                 description: Time for the viewing (HH:MM in 24-hour format)
 *                 example: "14:30"
 *     responses:
 *       201:
 *         description: Lead converted and viewing scheduled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 viewing:
 *                   type: object
 *                   description: Viewing details
 *       404:
 *         description: Lead not found
 */
router.post(
  "/:leadId/convert-and-schedule",
  asyncHandler(convertLeadToClientAndSchedule)
)

export default router
