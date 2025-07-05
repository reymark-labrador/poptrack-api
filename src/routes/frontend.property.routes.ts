import { Router } from "express"
import asyncHandler from "../utils/asyncHandler"
import {
  getProperties,
  getPropertyById,
} from "../controllers/frontend.property.controllers"

const router = Router()

/**
 * @swagger
 * /api/frontend/properties:
 *   get:
 *     summary: Get all properties (frontend)
 *     tags: [FrontendProperties]
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
 *         name: bedrooms
 *         schema:
 *           type: number
 *         description: Filter by number of bedrooms
 *       - in: query
 *         name: bathrooms
 *         schema:
 *           type: number
 *         description: Filter by number of bathrooms
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by amenities
 *       - in: query
 *         name: archived
 *         schema:
 *           type: boolean
 *         description: Filter by archived status
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
 * /api/frontend/properties/{id}:
 *   get:
 *     summary: Get property by ID (frontend)
 *     tags: [FrontendProperties]
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

export default router
