const Shopify = require("shopify-api-node");
const con = require("../connection/sqlConnector");

const webhookController = {
  registerOrderCreateWebhook: async (req, res) => {
    var topicArray = [
      "orders/create",
      "orders/fulfilled",
      "orders/paid",
      "orders/updated",
      "orders/cancelled",
    ];

    var store_name_slug = req.body.domain.split(".")[0];
    const shopify = new Shopify({
      shopName: store_name_slug,
      accessToken: req.body.accessToken,
    });

    let sql = `UPDATE shops SET webhook_registered = true, webhook_url = 'arn:aws:events:ap-south-1::event-source/aws.partner/shopify.com/6694687/datastudio', webhook_id1 = ?, webhook_id2 = ?, webhook_id3 = ?, webhook_id4 = ?, webhook_id5 = ?  WHERE name = '${req.body.domain}'`;

    let sqlValues = [];

    await topicArray.forEach(async (topic,i,topics) => {  
      const Webhookdata = {
        topic: topic,
        address:
        "arn:aws:events:ap-south-1::event-source/aws.partner/shopify.com/6694687/datastudio",
        format: "json",
        fields: [],
      };

    await shopify.webhook.create(Webhookdata).then((response) => {
        console.log("webhook created : " + response.id + " for topic : " + response.topic );
        sqlValues.push(response.id);
    }).catch((err) =>
        console.log("error in register webhook ", err)
      );
    });

    setTimeout(async ()=>{
      await con.query(sql,sqlValues,function(error,results,fields){
        if(error) res.status(500).send({err:error,msg:"failed, please try again after sometime !"});
        else res.status(200).send({err:null,msg:"successfully connected !"});
      });
    },6000)
  },
};

module.exports = webhookController;
