import Contact from "../models/contacts.js";

// Controller function to get all contacts
export const getAllContacts = async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving contacts", error: error.message });
    }
  };