const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      reuired: true,
    },
    salt: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/images.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedpassword;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw new Error("Sorry user not found");
  const salt = user.salt;
  const hashedpassword = user.password;

  const userProviderHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedpassword !== userProviderHash)
    throw new Error("Incorrect Password");

  return { ...user._doc, password: undefined, salt: undefined };
});

const User = model("user", userSchema);

module.exports = User;
