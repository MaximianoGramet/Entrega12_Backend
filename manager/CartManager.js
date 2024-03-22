import fs from "fs"


export class CartManager{
    constructor(path){
        this.path = path;
        try {
            let carts = fs.readFileSync(this.path, "utf-8");
            this.listOfCarts = JSON.parse(carts);
        } catch {
            this.listOfCarts = [];
            fs.writeFileSync(this.path, JSON.stringify(this.listOfCarts, null, "\t"));
        }
    }


    async AddCart(){
        let idCart = 0;
        if (this.listOfCarts.length == 0) {
            idCart = 1;
        } else {
            idCart = this.listOfCarts[this.listOfCarts.length - 1].id + 1;
        }
        this.listOfCarts.push({id:idCart,products:[]})
        await fs.promises.writeFile(this.path,JSON.stringify(this.listOfCarts,null,"\t"));

    }

    async AddToCart(CartID,ProductID){
        const index = this.listOfCarts.findIndex((element)=>element.id==Number(CartID))

        if(index>=0){

            const productFinder =this.listOfCarts[index].products.find((element)=>element.product==Number(ProductID))
            if(productFinder){


                this.listOfCarts[index].products[this.listOfCarts[index].products.findIndex((element)=>element.product==Number(ProductID))].quantity +=1
            } else {
                this.listOfCarts[index].products.push({"product": Number(ProductID), "quantity": 1})
            }     

            await fs.promises.writeFile(this.path, JSON.stringify(this.listOfCarts, null, "\t"));

        }else {
            throw new Error("Product not found")
        }
    }

    getCartID(cid){
        const product = this.listOfCarts.find(element=>element.id==cid)
        if(!product){
            throw new Error("Cart not found")
        }
        return product
    }

    getCarts(){
        return this.listOfCarts;
    }
}


export class Cart {
    constructor(){
        this.products = [];
    }
}