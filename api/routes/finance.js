import express from "express"
import { getItems, addItem, updateItem, deleteItem } from "../controllers/finance.js"

const router = express.Router()

router.get("/", getItems)

router.post("/", addItem)

router.put("/:id", updateItem)

router.delete("/:id", deleteItem)

export default router