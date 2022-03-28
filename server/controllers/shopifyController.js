const ShopifyStrategy = require("passport-shopify").Strategy;
const passport = require("passport");
const con = require("../connection/sqlConnector");


passport.serializeUser(function (merchant, done) {
  console.log("serializing -----------------> ",merchant.id);
  done(null, merchant);
});

passport.deserializeUser(function (merchant, done) {
  console.log("deserializing ---------->",merchant.id);
  con.query(`SELECT * FROM shops WHERE id='${merchant.id}'`, function(err, row) {
    console.log("inside deserializer SQL Function");
    if(err) {
      console.log(err);
      done(err);
    } else {
      if (row && row.length) {
        console.log('Merchant Found in deserializer');
        return done(null, row[0]);
        } 
  }});
});

const shopifyController = {

  validateMerchantShopify: (req, res) => {
    if (req.query.shop != "") {
      passport.use(
        "shopify",
        new ShopifyStrategy(
          {
            clientID:process.env.CLIENT_ID,
            clientSecret:process.env.CLIENT_SECRET,
            callbackURL:process.env.CALLBACK_URL,
            shop: req.query.shop,
          },
          (accessToken, refreshToken, profile, done) => {

            console.log(accessToken);
            console.log(profile._json.shop.id);
            //console.log(profile);

            con.query(`SELECT * FROM shops WHERE name='${profile._json.shop.domain}'`, function(err, row) {
              if(err) {
                done(err);
              } else {
                if (row && row.length) {
                  console.log('Merchant Already Found');
                  done(null, row[0]);
                  } else {
                  console.log("No merchant Found");
                  var dateString = new Date().toLocaleString();
                  var insertShopQuery="INSERT INTO shops (id,name,email,accessToken,created_at,webhook_registered,webhook_url) VALUES (?,?,?,?,?,?,?)";
                  var insertShopValues=[profile._json.shop.id,profile._json.shop.domain,profile._json.shop.email,accessToken,dateString,false,null];
                  var user = {
                    id:profile._json.shop.id,
                    name:profile._json.shop.domain,
                    email:profile._json.shop.email,
                    accessToken:accessToken,
                    created_at:dateString,
                    webhook_registered:false,
                    webhook_url:null
                  }
                  con.query(insertShopQuery,insertShopValues,function(error,result,fields){
                    if(error){
                    console.log(error);
                    done(error);
                  }else{
                    console.log("Merchant Saved");  
                    done(null, user);
                    }
                  });
                  }
                }
            });
          }
        )
      );
      return passport.authenticate("shopify", {
        scope: [
          "read_orders",
          "read_products",
        ],
        shop: req.query.shop,
      })(req, res);
    } else {
      res.send("enter shop name");
    }
  },

  validateMerchantShopifyCallback:(req,res)=>{
    res.json(req.user);
  },
  test: (req, res) => {
    res.send("All Ok");
  },
  destroySession: (req, res) => {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  },
  startupDetails:(req,res)=>{
    con.query(`SELECT * FROM shops WHERE id='${req.query.id}'`, function(error, row) {
      if(error) {
        console.log(error);
        res.status(500).send({err:error,msg:"fail to get details"})
      } else {
        if (row && row.length) {
          console.log('Merchant Found');
          res.status(200).send(row[0]);
          } 
    }});
  }
};

module.exports = shopifyController;