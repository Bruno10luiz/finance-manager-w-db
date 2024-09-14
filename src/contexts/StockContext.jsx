import { createContext, useEffect, useState } from "react"
import PropTypes from "prop-types"

export const StockContext = createContext({})

export function StockContextProvider({ children }) {
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [total, setTotal] = useState(0)
    const [items, setItems] = useState([])

    // Função para buscar os itens da API ao carregar o componente
    useEffect(() => {
        fetch("http://localhost:3306/")
            .then((response) => response.json())
            .then((data) => {
                // Converte as datas recebidas para objetos de Dat
                const parsedItems = data.map(item => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                }))
                setItems(parsedItems)
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

    const addItem = (item) => {
        fetch("http://localhost:3306/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
            .then((response) => response.json())
            .then((newItem) => {
                setItems((current) => [newItem, ...current])
            })
    }

    const updateItem = (itemId, newAttributes) => {
        fetch(`http://localhost:3306/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: itemId, ...newAttributes }),
        })
            .then((response) => response.json())
            .then((updatedItem) => {
                setItems((current) => {
                    const updatedItems = current.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item
                    )
                    return updatedItems
                })
            })
    }

    const deleteItem = (itemId) => {
        fetch(`http://localhost:3306/${itemId}`, {
            method: "DELETE",
        }).then(() => {
            setItems((current) => current.filter((item) => item.id !== itemId))
        })
    }

    const stock = {
        items,
        addItem,
        updateItem,
        deleteItem,
        income,
        expense,
        total,
    }

    return (
        <StockContext.Provider value={stock}>
            {children}
        </StockContext.Provider>
    )
}

StockContextProvider.propTypes = {
    children: PropTypes.node,
}

