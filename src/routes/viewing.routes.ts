import { Router } from "express"
import {
  createViewing,
  updateViewing,
  getAllViewings,
} from "../controllers/viewing.controller"
import asyncHandler from "../utils/asyncHandler"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Viewing:
 *       type: object
 *       required: [client, property, scheduledAt]
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d0fe4f5311236168a109cb"
 *         client:
 *           type: string
 *           description: Client ID
 *           example: "60d0fe4f5311236168a109ca"
 *         property:
 *           type: string
 *           description: Property ID
 *           example: "60d0fe4f5311236168a109cd"
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T10:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [scheduled, completed, no-show]
 *           example: "scheduled"
 *         notes:
 *           type: string
 *           example: "Client requested a morning viewing."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T09:00:00.000Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ViewingResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Viewing'
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
 *               description: Total count of viewings
 *               example: 25
 *             totalPages:
 *               type: number
 *               description: Total number of pages
 *               example: 3
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
 * /api/viewings:
 *   get:
 *     summary: Get all viewings with pagination
 *     tags: [Viewings]
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
 *         description: List of viewings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ViewingResponse'
 */
router.get("/", asyncHandler(getAllViewings))

/**
 * @swagger
 * /api/viewings:
 *   post:
 *     summary: Create a new viewing
 *     tags: [Viewings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Viewing'
 *     responses:
 *       201:
 *         description: Viewing created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Viewing'
 *       400:
 *         description: Invalid input
 */
router.post("/", asyncHandler(createViewing))

/**
 * @swagger
 * /api/viewings/{id}:
 *   patch:
 *     summary: Update a viewing by ID
 *     tags: [Viewings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Viewing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, no-show]
 *                 example: "completed"
 *               notes:
 *                 type: string
 *                 example: "Client did not show up."
 *     responses:
 *       200:
 *         description: Viewing updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Viewing'
 *       404:
 *         description: Viewing not found
 */
router.patch("/:id", asyncHandler(updateViewing))

export default router
