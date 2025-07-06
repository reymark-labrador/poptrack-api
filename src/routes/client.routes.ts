import { Router } from "express"
import { getClients, getClientById } from "../controllers/client.controller"
import asyncHandler from "../utils/asyncHandler"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required: [name, email]
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         viewings:
 *           type: array
 *           items:
 *             type: string
 *           example: ["60d0fe4f5311236168a109cb"]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClientResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Client'
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
 *               description: Total count of clients
 *               example: 30
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
 * /api/clients:
 *   get:
 *     summary: Get all clients with pagination
 *     tags: [Clients]
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
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientResponse'
 */
router.get("/", asyncHandler(getClients))

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 */
router.get("/:id", asyncHandler(getClientById))

export default router
