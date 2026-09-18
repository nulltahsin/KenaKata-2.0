const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyToken = require("../middleware/authMiddleware");
const { revokeToken } = require("../middleware/tokenBlacklist");



// ================= REGISTER =================

router.post("/register", async (req,res)=>{

    const client = await pool.connect();

    try{


        const {

            name,
            email,
            phone,
            password,
            role,
            delivery_address,
            business_name

        } = req.body;



        const normalizedEmail =
            String(email || "").trim().toLowerCase();



        if(!name || !normalizedEmail || !password || !role){

            return res.status(400).json({

                message:"Required fields missing"

            });

        }



        if(role !== "CUSTOMER" && role !== "VENDOR"){

            return res.status(400).json({

                message:"Invalid role"

            });

        }



        if(password.length < 6){

            return res.status(400).json({

                message:"Password must be at least 6 characters"

            });

        }



        if(role === "VENDOR" && !business_name){

            return res.status(400).json({

                message:"Business name is required for vendor"

            });

        }





        await client.query("BEGIN");




        const existingUser = await client.query(

            `
            SELECT user_id
            FROM users
            WHERE email=$1
            `,

            [normalizedEmail]

        );



        if(existingUser.rows.length > 0){

            await client.query("ROLLBACK");

            return res.status(409).json({

                message:"Email already exists"

            });

        }





        const password_hash =
            await bcrypt.hash(password,10);





        const userResult = await client.query(

            `
            INSERT INTO users
            (
                name,
                email,
                phone,
                password_hash,
                role
            )

            VALUES($1,$2,$3,$4,$5)

            RETURNING
                user_id,
                name,
                email,
                phone,
                role
            `,

            [

                name,
                normalizedEmail,
                phone || null,
                password_hash,
                role

            ]

        );





        const user_id =
            userResult.rows[0].user_id;





        if(role === "CUSTOMER"){


            await client.query(

                `
                INSERT INTO customers
                (
                    user_id,
                    delivery_address
                )

                VALUES($1,$2)

                `,

                [

                    user_id,
                    delivery_address || null

                ]

            );

        }





        if(role === "VENDOR"){


            await client.query(

                `
                INSERT INTO vendors
                (
                    user_id,
                    business_name
                )

                VALUES($1,$2)

                `,

                [

                    user_id,
                    business_name

                ]

            );

        }





        await client.query("COMMIT");





        const token = jwt.sign(

            {
                user_id,
                role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"1d"
            }

        );





        res.status(201).json({

            message:"Registration successful",

            token,

            user:userResult.rows[0]

        });



    }

    catch(error){

        await client.query("ROLLBACK");

        console.error(error);


        res.status(500).json({

            message:error.message

        });

    }


    finally{

        client.release();

    }

});







// ================= LOGIN =================


router.post("/login", async(req,res)=>{


    try{


        const {

            email,
            password

        } = req.body;




        const normalizedEmail =
            String(email || "").trim().toLowerCase();




        if(!normalizedEmail || !password){

            return res.status(400).json({

                message:"Email and password required"

            });

        }






        const result = await pool.query(

            `
            SELECT
                user_id,
                name,
                email,
                phone,
                password_hash,
                role

            FROM users

            WHERE email=$1

            `,

            [

                normalizedEmail

            ]

        );






        if(result.rows.length === 0){

            return res.status(401).json({

                message:"Invalid credentials"

            });

        }






        const user = result.rows[0];






        const match =
            await bcrypt.compare(

                password,

                user.password_hash

            );





        if(!match){

            return res.status(401).json({

                message:"Invalid credentials"

            });

        }






        const token = jwt.sign(

            {

                user_id:user.user_id,

                role:user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn:"1d"

            }

        );







        res.json({

            message:"Login successful",

            token,

            user:{

                user_id:user.user_id,

                name:user.name,

                email:user.email,

                phone:user.phone,

                role:user.role

            }

        });



    }


    catch(error){


        console.error(error);


        res.status(500).json({

            message:error.message

        });

    }


});









// ================= LOGOUT =================


router.post("/logout",

    verifyToken,

    (req,res)=>{


        const token =
            req.headers.authorization.split(" ")[1];



        revokeToken(token);



        res.json({

            message:"Logout successful"

        });


    }

);





module.exports = router;