import { useContext } from "react";
import { FinanceContext } from "../contexts/FinanceContext";

export default function useStock() {
    return useContext(FinanceContext)
}