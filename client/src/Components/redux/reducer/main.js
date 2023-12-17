import { getProductsreducers } from "./Productsreducer";
import {combineReducers} from "redux";
const rootreducers = combineReducers({
    getproductsdata : getProductsreducers
});

export default rootreducers;