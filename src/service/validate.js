export const ValidateData = async (data) => {

  return Object.keys(data).filter((key) => !data[key]);
  /*  
    {
        username: "", 0
        password: "ok" 1
    }
  */
};
