import bcrypt from "bcrypt";

export const hash = async (pswd) => {
  try {
    const saltRounds = 10;
    const hashedPswd = await bcrypt.hash(pswd, saltRounds);
    return hashedPswd;
  } catch (error) {
    console.log(error);
  }
};

export const compare = async (pswd, hashedPswd) => {
  return bcrypt.compare(pswd, hashedPswd);
};
