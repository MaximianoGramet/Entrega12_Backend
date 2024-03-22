import {CartDao} from         "./daos/dbManager/cart.dao.js";
import ProductDao from      "./daos/dbManager/product.dao.js";
import TicketDao from       "./daos/dbManager/ticket.dao.js";
import CartRepository from  "./repository/cart.repository.js";
import ProductRepository from "./repository/product.repository.js";
import TicketRepository from "./repository/ticket.repository.js";

const productDao = new ProductDao()
const cartDao = new CartDao()
const ticketDao = new TicketDao()

export const productService = new ProductRepository(productDao)
export const CartService = new CartRepository(cartDao)
export const ticketService = new TicketRepository(ticketDao)
