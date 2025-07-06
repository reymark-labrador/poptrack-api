import { Router } from "express"
import asyncHandler from "../utils/asyncHandler"
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  archiveProperty,
  unarchiveProperty,
  convertAndSchedule,
} from "../controllers/property.controllers"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required: [title, price, location]
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         title:
 *           type: string
 *           example: "Modern Downtown Apartment"
 *         description:
 *           type: string
 *           example: "Beautiful 2-bedroom apartment in city center"
 *         price:
 *           type: number
 *           example: 250000
 *         type:
 *           type: string
 *           enum: [apartment, house, villa, commercial]
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: "New York"
 *             address:
 *               type: string
 *               example: "123 Main St"
 *         bedrooms:
 *           type: number
 *           example: 2
 *         bathrooms:
 *           type: number
 *           example: 2
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["parking", "gym", "pool"]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://example.com/image1.jpg"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PropertyResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Property'
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
 *               description: Total count of properties
 *               example: 150
 *             totalPages:
 *               type: number
 *               description: Total number of pages
 *               example: 15
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
 * /api/properties:
 *   get:
 *     summary: Get all properties with filtering and pagination
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [apartment, house, villa, commercial]
 *         description: Filter by property type
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by exact city name
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Search by location (searches both city and address fields)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
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
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyResponse'
 *       500:
 *         description: Server error
 */
router.get("/", asyncHandler(getProperties))

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get("/:id", asyncHandler(getPropertyById))

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create new property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Property created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       400:
 *         description: Invalid input
 */
router.post("/", createProperty)

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.put("/:id", asyncHandler(updateProperty))

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property deleted successfully"
 *       404:
 *         description: Property not found
 */
router.delete("/:id", asyncHandler(deleteProperty))

/**
 * @swagger
 * /api/properties/{id}/archive:
 *   patch:
 *     summary: Archive a property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property archived
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Property archived
 *       404:
 *         description: Property not found
 */
router.patch("/:id/archive", asyncHandler(archiveProperty))

/**
 * @swagger
 * /api/properties/{id}/unarchive:
 *   patch:
 *     summary: Unarchive a property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property unarchived
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Property unarchived
 *       404:
 *         description: Property not found
 */
router.patch("/:id/unarchive", asyncHandler(unarchiveProperty))

/**
 * @swagger
 * /api/properties/{id}/convert-and-schedule:
 *   post:
 *     summary: Convert a lead to a viewing and schedule it
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, scheduledAt]
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: Client ID
 *                 example: "60d0fe4f5311236168a109ca"
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled viewing date and time
 *                 example: "2024-06-01T10:00:00.000Z"
 *               notes:
 *                 type: string
 *                 description: Optional notes for the viewing
 *                 example: "Client requested a morning viewing"
 *     responses:
 *       201:
 *         description: Lead converted to viewing and scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lead converted to viewing and scheduled successfully"
 *                 viewing:
 *                   $ref: '#/components/schemas/Viewing'
 *       400:
 *         description: Invalid input - missing required fields
 *       404:
 *         description: Property not found
 *       500:
 *         description: Server error
 */
router.post("/:id/convert-and-schedule", asyncHandler(convertAndSchedule))

export default router
