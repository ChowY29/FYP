import Donation from "../models/donations.js";


export const addDonation = async (req, res) => {
  const { title, details, targetAmount, images } = req.body;

  if (!title || !details || !targetAmount || images.length === 0) {
    return res.status(400).json({
      error: "All fields are required and at least one image must be uploaded.",
    });
  }

  try {
    const newDonation = new Donation({
      title,
      description: details,
      fundsRaised: 0,
      fundsTarget: targetAmount,
      images: images, // Directly store base64 strings
      donors: [],
    });

    await newDonation.save();

    return res.status(201).json({
      message: "Donation added successfully",
      donation: newDonation,
    });
  } catch (error) {
    console.log("Error saving donation:", error);
    return res.status(500).json({ error: error.message });
  }
};

//get all donations for landing page and manage donations scenes
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().select({
      title: 1,
      fundsRaised: 1,
      fundsTarget: 1,
      description:1,
      images: { $slice: 1 }, // Limit to first image in the array
    });

    return res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

//get donation from id
export const getDonationById = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.status(200).json(donation);
  } catch (error) {
    console.error("Error fetching donation:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const editDonation = async (req, res) => {
  const { id } = req.params;
  const { title, description, fundsRaised, fundsTarget, images } = req.body;

  try {
    let updatedData = {
      title,
      description,
      fundsRaised,
      fundsTarget,
    };

    if (images && images.length > 0) {
      updatedData.images = images; // Assuming images are already Base64 encoded
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(updatedDonation);
  } catch (error) {
    console.error("Error editing donation:", error);
    res.status(500).json({ message: "Failed to edit donation" });
  }
};


export const deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDonation = await Donation.findByIdAndDelete(id);

    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ message: "Failed to delete donation" });
  }
};

// Add donor to donation after successful payment
export const addDonorToDonation = async (req, res) => {
  const { userId, donationId, name, email, amount, timestamp, comment } = req.body;

  try {
    // Find the donation by donationId
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found.' });
    }

    // Construct donor object
    const donor = {
      userId: userId,
      name: name,
      amount: amount,
      timestamp: timestamp,
      comment: comment,
    };

    // Add donor to donors array
    donation.donors.push(donor);

    // Update fundsRaised in donation
    donation.fundsRaised += amount;

    // Save updated donation
    await donation.save();

    // Respond with updated donation
    res.status(200).json({ message: 'Donor added successfully.', donation: donation });
  } catch (error) {
    console.error('Error adding donor:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get donation history for a specific user
export const getDonationHistoryByUserId = async (req, res) => {

  try {
    const { id } = req.params;
    console.log("userId from request params:", id);

    // Query donations where donors.userId matches id
    const donations = await Donation.find({ "donors.userId": id });
    console.log("Donations found:", donations);

    // Process donations to extract relevant donor data
    const donationHistory = donations.flatMap(donation => {
      return donation.donors // Access the donors array within each donation
        .filter(donor => donor.userId.toString() === id) // Filter donors by userId match
        .map(donor => ({
          id: donation._id,
          title: donation.title,
          description: donation.description,
          fundsRaised: donation.fundsRaised,
          fundsTarget: donation.fundsTarget,
          amount: donor.amount,
          timestamp: donor.timestamp,
          comment: donor.comment,
        }));
    });

    res.status(200).json(donationHistory);
  } catch (error) {
    console.log("Error fetching donation history:", error);
    res.status(500).json({ error: "Failed to fetch donation history" });
  }
};