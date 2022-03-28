export default function requireAuthentication(gssp) {
  return async (context) => {
    const { req, res } = context;
    //console.log("inside authentication ................................");
    const passportSession = req.session.passport;
    //console.log(passportSession);
    if (passportSession == undefined) {
      return {
        redirect: { permenent: false, destination: "/shopify/logout" },
      };
    }
    return await gssp(context);
  };
}