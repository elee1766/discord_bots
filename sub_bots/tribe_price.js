import { uniV2Price } from "../shared/eth_query.js";
import {db} from "../shared/db.js";
import Discord from "discord.js";

const client = new Discord.Client();

client.on('ready',()=>{
  console.log(`${client.user.tag} now online`)
})


const get_tribe_price = async ()=>{
  return uniV2Price("0x7ce01885a13c652241ae02ea7369ee8d466802eb",18,18,true).then((tribe)=>{
    uniV2Price("0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",6,18,true).then((eth)=>{
      const price = eth.times(tribe).toNumber()
      db.put('last_tribe_price',price);
    })
  });
}

export const start_tribe_price = async (token) => {
  client.login(token).then(async ()=>{
    await update();
    await tick();
  })
}

const tick = async () =>{
  db.get('last_tribe_price').then((price)=>{
    client.user.setActivity(`market cap: $${(price*1000000000).toLocaleString()}`)
    client.guilds.cache.array().forEach((guild)=>{
      guild.me.setNickname(`! $${(Math.floor(price*100)/100).toLocaleString()}`)
    })
  }).catch(()=>{});
}

const update = async () =>{
  console.log(new Date().toLocaleString(),"update tribe_price")
  await get_tribe_price();
}

setInterval(update,1000*60*5)
setInterval(tick,1000*30)

