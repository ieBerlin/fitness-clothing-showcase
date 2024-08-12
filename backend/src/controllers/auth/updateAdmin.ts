// import { Request, Response } from "express";
// import ValidationError from "../../utils/ValidationError";
// import { emailValidator, passwordValidator } from "../../utils/validators";
// import {
//   updateAdmin as modifyAdmin,
//   doesAdminExist,
// } from "../../services/adminService";

// const updateAdmin = async (req: Request, res: Response) => {
//   try {
//     const { adminId } = req.params;
//     const { email, password } = req.body;

//     const errors: ValidationError[] = [];
    
//     if (!email || (!emailValidator(email) || typeof email !== "string")) {
//       errors.push({ field: "email", message: "Invalid email" });
//     }
    
//     // Validate password
//     if (password && (!passwordValidator(password) || typeof password !== "string")) {
//       errors.push({ field: "password", message: "Invalid password" });
//     }

//     if (errors.length > 0) {
//       return res.status(400).json({ success: false, errors });
//     }

//     // Check if the email is already in use by another admin
//     if (email) {
//       const existingAdmin = await doesAdminExist(email);
//       if (existingAdmin && existingAdmin.adminId !== adminId) {
//         return res.status(400).json({ success: false, message: "Email already in use" });
//       }
//     }

//     // Update admin
//     const updatedAdmin = await modifyAdmin(adminId, { email, password });

//     if (!updatedAdmin) {
//       return res.status(404).json({ success: false, message: "Admin not found" });
//     }

//     res.status(200).json({ success: true, message: "Admin updated successfully", admin: updatedAdmin });
    
//   } catch (error) {
//     console.error("Error updating admin:", error.message || "Error updating admin");
//     res.status(500).json({ success: false, message: "Error updating admin" });
//   }
// };

// export default updateAdmin;
