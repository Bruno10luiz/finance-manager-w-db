import { createContext, useEffect, useState } from "react"
import PropTypes from "prop-types"

export const FinanceContext = createContext({})

export function FinanceContextProvider({ children }) {
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [total, setTotal] = useState(0)
    const [items, setItems] = useState([])

    // Função para buscar os itens da API ao carregar o componente
    useEffect(() => {
        fetch("http://localhost:3000")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch items")
                }
                return response.json()
            })
            .then((data) => {
                const parsedItems = data.map(item => (({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                })))
                setItems(parsedItems)
            })
            .catch((error) => {
                console.error("failed to fetch", error)
            })
    }, [])

    useEffect(() => {
        const expense = items
            .filter(item => item.expense)
            .reduce((acc, cur) => acc + Number(cur.amount), 0)

        const income = items
            .filter(item => !item.expense)
            .reduce((acc, cur) => acc + Number(cur.amount), 0)

        const total = income - expense

        setIncome(income)
        setExpense(expense)
        setTotal(total)
    }, [items])

    const getItem = (itemId) => {
        return items.find(item => item.id === +itemId)
    }

    const addItem = (item) => {
        fetch("http://localhost:3000/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add item")
                }
                return response.json()
            })
            .then((newItem) => {
                setItems((current) => [newItem, ...current])
            })
            .catch((error) => {
                console.error("Error adding item:", error)
            })
    }

    const updateItem = (itemId, newAttributes) => {
        fetch(`http://localhost:3000`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: itemId, ...newAttributes }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update item")
                }
                return response.json()
            })
            .then((updatedItem) => {
                setItems((current) => current.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                ))
            })
            .catch((error) => {
                console.error("Error updating item:", error)
            })
    }

    const deleteItem = (itemId) => {
        fetch(`http://localhost:3000`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete item")
                }
                setItems((current) => current.filter((item) => item.id !== itemId))
            })
            .catch((error) => {
                console.error("Error deleting item:", error)
            })
    }

    const finance = {
        items,
        getItem,
        addItem,
        updateItem,
        deleteItem,
        income,
        expense,
        total,
    }

    return (
        <FinanceContext.Provider value={finance}>
            {children}
        </FinanceContext.Provider>
    )
}

FinanceContextProvider.propTypes = {
    children: PropTypes.node,
}

