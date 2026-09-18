import api from "./api";


export const loginUser = async (email, password) => {

  const response = await api.post(
    "/api/auth/login",
    {
      email,
      password
    }
  );

  return response.data;

};



export const registerUser = async ({
  name,
  email,
  phone,
  password,
  role,
  delivery_address,
  business_name
}) => {

  const response = await api.post(
    "/api/auth/register",
    {
      name,
      email,
      phone,
      password,
      role,
      delivery_address,
      business_name
    }
  );

  return response.data;

};



export const getVendorProfile = async (userId) => {

  const response = await api.get(
    `/api/vendors/${userId}`
  );

  return response.data;

};



export const updateVendorProfile = async (userId, profile) => {

  const response = await api.patch(
    `/api/vendors/${userId}`,
    profile
  );

  return response.data;

};



export const logoutUser = async () => {

  const response = await api.post(
    "/api/auth/logout"
  );

  return response.data;

};