const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken=require("../middleware/authMiddleware");
const checkRole=require("../middleware/roleMiddleware");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      email,
      phone,
      password_hash,
      business_name,
    } = req.body;

    await client.query("BEGIN");

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
      VALUES($1,$2,$3,$4,'VENDOR')
      RETURNING user_id
      `,

      [name, email, phone, password_hash]

    );
    const user_id = userResult.rows[0].user_id;
    const vendorResult = await client.query(
      `
      INSERT INTO vendors
      (
          user_id,
          business_name
      )
      VALUES($1,$2)
      RETURNING *
      `,
      [user_id, business_name]

    );



   await client.query(
`
INSERT INTO stores
(
    vendor_id,
    market_id,
    store_name,
    address,
    description,
    logo_url,
    category
)
VALUES($1,$2,$3,$4,$5,$6,$7)
`,
[
    user_id,
    1,
    business_name,
    'Not provided',
    '',
    '',
    ''
]
);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Vendor created successfully",
      vendor: vendorResult.rows[0],

    });
  } 
  catch (error) {
    console.error(error);

    res.status(500).json({ 
        message: error.message 
    });
  } 
  finally {
    client.release();
  }
});


//vendor nijer profile dekhte parbe

//onno vendor er business information access korte parbe na

router.get("/:id",
    verifyToken,
    checkRole("VENDOR"),
     async (req, res) => {
  try {
    const user_id = req.params.id;

    const logged_user_id=req.user.user_id;

    if(Number(user_id)!==logged_user_id){
        return res.status(403).json({
            message:"You cannot access another vendors profile"
        });
    }
    const result = await pool.query(
      `
      SELECT
          u.user_id,
          u.name,
          u.email,
          u.phone,
          u.role,
          v.business_name
      FROM users u
      JOIN vendors v
      ON u.user_id = v.user_id
      WHERE u.user_id=$1
      `,
      [user_id]

    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(result.rows[0]);
  }
   catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


 //vendor nijer store er product count dekhbe

router.get(
"/vendor/me",
verifyToken,
checkRole("VENDOR"),
async(req,res)=>{

const result = await pool.query(
`
SELECT *
FROM products p
JOIN stores s
ON p.store_id=s.store_id
WHERE s.vendor_id=$1
`,
[req.user.user_id]
);


res.json(result.rows);

});






//vendor nijer business information update korte parbe

//onnoder vendor profile update block kora holo

router.patch("/:id", 
    verifyToken,
    checkRole("VENDOR"),
    async (req, res) => {
  try {
    const user_id = req.params.id;
    const logged_user_id=req.user.user_id;

   


    if(Number(user_id)!==logged_user_id){

      return res.status(403).json({

        message:"You cannot update another vendor's profile"

      });

    }
           const { name, phone, email, business_name, current_password, new_password } = req.body;

    if(!name || !email || !business_name){
      return res.status(400).json({ message:"Name, email and business name are required" });
    }

    const existingEmail = await pool.query(
      `SELECT user_id FROM users WHERE email=$1 AND user_id<>$2`,
      [email, user_id]
    );
    if(existingEmail.rows.length > 0){
      return res.status(409).json({ message:"This email is already in use" });
    }

    if(new_password){
      if(!current_password){
        return res.status(400).json({ message:"Current password is required to set a new password" });
      }
      if(new_password.length < 6){
        return res.status(400).json({ message:"New password must be at least 6 characters" });
      }
      const passwordResult = await pool.query(
        `SELECT password_hash FROM users WHERE user_id=$1`,
        [user_id]
      );
      const passwordMatches = await bcrypt.compare(current_password, passwordResult.rows[0].password_hash);
      if(!passwordMatches){
        return res.status(400).json({ message:"Current password is incorrect" });
      }
      const passwordHash = await bcrypt.hash(new_password, 10);
      await pool.query(
        `UPDATE users SET name=$1, phone=$2, email=$3, password_hash=$4 WHERE user_id=$5`,
        [name, phone || null, email, passwordHash, user_id]
      );
    } else {
      await pool.query(
        `UPDATE users SET name=$1, phone=$2, email=$3 WHERE user_id=$4`,
        [name, phone || null, email, user_id]
      );
    }

    const result = await pool.query(
      `
      UPDATE vendors
      SET
         business_name=$1
      WHERE user_id=$2
      RETURNING *
      `,
      [business_name, user_id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      message: "Vendor profile updated successfully",
      vendor: result.rows[0],
    });
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
