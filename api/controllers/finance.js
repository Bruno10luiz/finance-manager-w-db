import { db } from "../db.js";

export const getItems = (_, res) => {
    const qry = "SELECT * FROM financial";

    db.query(qry, (err, data) => {
        if (err) {
            console.error("Erro ao acessar o banco de dados:", err)
            return res.status(500).json({ message: "Erro ao acessar o banco de dados", error: err })
        }
        return res.status(200).json(data)
    })
}

export const addItem = (req, res) => {
    const qry = "INSERT INTO financial (`name`, `amount`, `category`, `description`, `expense`, `createdAt`, `updatedAt`) VALUES(?)";

    const values = [
        req.body.name,
        req.body.amount,
        req.body.category,
        req.body.description,
        req.body.expense,
        new Date(),
        new Date(),
    ];

    db.query(qry, [values], (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao criar o item", error: err });
        return res.status(201).json({ message: "Item criado com sucesso.", id: result.insertId });
    });
};


export const updateItem = (req, res) => {
    const qry = "UPDATE financial SET `name` = ?, `amount` = ?, `category` = ?, `description` = ?, `expense` = ?, `updatedAt` = ? WHERE `id` = ?"

    const values = [
        req.body.name,
        req.body.amount,
        req.body.category,
        req.body.description,
        req.body.expense ? 1 : 0,
        new Date(),
    ];

    db.query(qry, [...values, req.params.id], (err) => {
        if (err) {
            console.error("Erro ao atualizar o item:", err)
            return res.status(500).json({ message: "Erro ao atualizar o item", error: err })
        }
        return res.status(200).json({ message: "Item atualizado com sucesso." })
    })
}

export const deleteItem = (req, res) => {
    const qry = "DELETE FROM financial WHERE `id` = ?"

    db.query(qry, [req.params.id], (err) => {
        if (err) {
            console.error("Erro ao deletar o item:", err)
            return res.status(500).json({ message: "Erro ao deletar o item", error: err })
        }
        return res.status(200).json({ message: "Item deletado com sucesso." })
    });
};

