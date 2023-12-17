const express = require ("express");
const router =new express.Router();
const Products=require("../models/productsSchema");
const products = require("../constant/productsdata");
const USER  = require("../models/userSchema");
const bcrypt =require("bcryptjs");
const authenicate = require("../middleware/authenticate");
//get product data api
router.get("/getproducts",async(req,res) =>{
    try{
        const productsdata= await Products.find();
        console.log("console the data" +productsdata);
       res.status(201).json(productsdata);
    }
    catch (error){
        console.log("error"+error.message);
    }
});

// getindividual

router.get("/getproductsone/:id", async (req, res) => {

    try {
        const { id } = req.params;
        console.log(id);
        const individualdata = await Products.findOne({ id: id });
        console.log(individualdata + "ind mila hai");
        res.status(201).json(individualdata);
    } catch (error) {
        res.status(400).json(error);
        console.log("error" +error.message);
    }
});

// register the data
router.post("/register", async (req, res) => {
    //console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "filll the all details" });
        console.log("bhai nathi present badhi details");
    };

    try {

        const preuser = await USER.findOne({ email:email });

        if (preuser) {
            res.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });;
        } else {

            const finalUser = new USER({
                fname, email, mobile, password, cpassword
            });

            // yaha pe hasing krenge

            const storedata = await finalUser.save();
             console.log(storedata + "user successfully added");
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error the bhai catch ma for registratoin time" + error.message);
        res.status(422).send(error);
    }

});


// login data
router.post("/login", async (req, res) => {
    //console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }

    try {

        const userlogin = await USER.findOne({ email: email });
        console.log(userlogin +"user value");
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log(isMatch +"pass match");
            const token = await userlogin.generatAuthtoken();
                //console.log(token);

                res.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });



         if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else {
                
                /*const token = await userlogin.generatAuthtoken();
                //console.log(token);

                res.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });*/
                res.status(201).json(userlogin);
            }

        } 
        else {
            res.status(400).json({ error: "user not exist" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid details" });
        console.log("error the bhai catch ma for login time" + error.message);
    }
});


// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {

    try {
        //console.log("perfect 6");
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart milta hain");

        const UserContact = await USER.findOne({ _id: req.userID });
        console.log(UserContact + "user milta hain");


        if (UserContact) {
            const cartData = await UserContact.addcartdata(cart);

            await UserContact.save();
            console.log(cartData + " thse save wait kr");
            console.log(UserContact + "userjode save");
            res.status(201).json(UserContact);
        }
        else{
            res.status(401).json({error:"invaild user"});
        }
    } catch (error) {
        res.status(401).json({error:"invaild user"});
        console.log(error);
    }
});
// get cart details
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id:req.userID });
        console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});

//get valid user
router.get("/validuser", authenicate, async (req, res) => {
    try {
        const validuserone = await User.findOne({ _id: req.userID });
        console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});

// remove item from cart

router.delete("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
            return cruval.id != id;
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("iteam remove");

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});

//for user logout

router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});


module.exports= router;