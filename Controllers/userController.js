const User = require("../Modals/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { firstName, lastName, phone, email, password, profilePhoto } =
    req.body;

  try {
    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exists." });
    }
    const phone_number_exist = await User.findOne({ phone });
    if (phone_number_exist) {
      return res
        .status(400)
        .send({ success: false, message: "Phone Number already exists." });
    }

    // Check if passwords match

    // Hash the password with salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      profilePhoto,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    return res.status(201).send({
      success: true,
      message: "User registered successfully.",
      token,
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};

//login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await User.findOne({ email }).select("password");
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "No user found with this email.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        status: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).send({
      status: true,
      message: "Login successful.",
      token,
      userId: user._id,
    });
  } catch (e) {
    console.error("Error during login:", e);
    return res.status(500).send({
      status: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};
