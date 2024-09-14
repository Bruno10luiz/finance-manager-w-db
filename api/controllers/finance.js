import { db } from "../db"

export const getItems = (_, res) => {
    const qry = "SELECT * FROM financial"

    db.query(qry, (err, data) => {
        if (err) return res.json(err)

        return res.status(200).json(data)
    })
}

export const addItem = (req, res) => {
    const qry =
        "INSERT INTO financial (`name`, `amount`, `category`, `description`, `expense`, `createdAt`, `updatedAt`) VALUES(?)";

    const values = [
        req.body.name,
        req.body.amount,
        req.body.category,
        req.body.description,
        req.body.expense,
        new Date(),
        new Date(),
    ]

    db.query(qry, [values], (err) => {
        if (err) return res.json(err)

        return res.status(200).json("Item criado com sucesso.")
    })
}

export const updateItem = (req, res) => {
    const qry =
        "UPDATE financial SET `name` = ?, `amount` = ?, `category` = ?, `description` = ?, `expense` = ?, `updatedAt` = ? WHERE `id` = ? "

    const values = [
        req.body.name,
        req.body.amount,
        req.body.category,
        req.body.description,
        req.body.expense, // Atualiza se é despesa ou não
        new Date(), // updatedAt
    ]

    db.query(qry, [...values, req.params.id], (err) => {
        if (err) return res.json(err)

        return res.status(200).json("Item atualizado com sucesso.");
    })
}

export const deleteItem = (req, res) => {
    const qry = "DELETE FROM financial WHERE `id` = ?"

    db.query(qry, [req.params.id], (err) => {
        if (err) return res.json(err)

        return res.status(200).json("Item deletado com sucesso.")
    })
}
