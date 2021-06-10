import { uniV2Price,pcv_amount } from "../shared/eth_query.js";
import {db} from "../shared/db.js";
import Discord from "discord.js";

const client = new Discord.Client();

client.on('ready',()=>{
  console.log(`${client.user.tag} now online`)
})


const get_pcv_stats = async ()=>{
  await uniV2Price("0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",6,18,true).then((price)=>{
      db.put('last_eth_price',price.toNumber());
  });

 await pcv_amount().then(async amount=>{
    db.put('last_pcv_amount',amount.toNumber());
  })
  return
}


export const start_pcv_stats = async (token) => {
  client.login(token).then(async ()=>{
    await update();
    await tick();
  })
}

const tick = async () =>{
  db.get('last_pcv_amount').then((amount)=>{
    db.get('last_eth_price').then((price)=>{
    client.user.setActivity(`pcv value: ${(Math.floor(amount)/100).toLocaleString()} ETH`)
    client.guilds.cache.array().forEach((guild)=>{
      guild.me.setNickname(`! $${(Math.floor(amount*price*100)/100).toLocaleString()}`)
    })
    })
  }).catch((e)=>{
console.log(e)
  });
}

const update = async () =>{
  console.log(new Date().toLocaleString(),"update pcv_stats")
  await get_pcv_stats();
}

setInterval(update,1000*60*5)
setInterval(tick,1000*30)

